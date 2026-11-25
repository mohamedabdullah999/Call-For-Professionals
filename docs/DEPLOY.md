# Deploy — Docker والنشر

> **السيرفر الحقيقي ما فيهوش Docker.** النشر عليه في القسم 4 (`pnpm release` + `scripts/deploy.sh`). ملفات Docker للتشغيل المحلي بس.

## 1. الـDocker في مشروعنا

| الملف | دوره |
|---|---|
| `Dockerfile` | وصفة بناء الـ**image**: بيسطّب الـpackages، ويعمل build، ويطلّع image صغيرة فيها السيرفر بس |
| `docker-compose.yml` | بيشغّل **container** للتطبيق و**container** لـ PostgreSQL مع بعض، ويربطهم ببعض |
| `.dockerignore` | الملفات اللي ما تدخلش الـimage (`node_modules` · `.env` · `.git`) |
| `/speakerreg/api/health` | Docker بيسأله كل 30 ثانية: «إنت شغال؟ والداتابيز شغالة؟» |

**الـDockerfile مقسوم 3 مراحل (multi-stage):**

```
deps   ← pnpm install                 (الـpackages بس)
build  ← pnpm build                   (بيطلّع .next/standalone)
run    ← node:22-alpine + standalone  ← الـimage النهائية، من غير أدوات البناء
```

**لما الـcontainer يشتغل:** بيعمل `migrate` الأول (ويستنى لحد ما الداتابيز تصحى)، وبعدين يشغّل السيرفر. والسيرفر بيشتغل بـ user عادي، مش root.

### الأوامر

```bash
docker compose up -d --build     # يبني ويشغّل كل حاجة → http://localhost:3000/speakerreg
docker compose ps                # الحالة (لازم web يبقى healthy)
docker compose logs -f web       # الـlogs
docker compose down              # يقفل (البيانات بتفضل محفوظة في volume)
docker compose up -d db          # الداتابيز بس، لو هتشتغل بـ pnpm dev
```

## 2. نشر مؤقت عشان نعرض على هاني

### الطريقة (أ): لينك فوري من جهازك — Cloudflare Tunnel

- مجاني، ومن غير حساب.
- اللينك شغال **طول ما جهازك صاحي والأمر شغال**.

```bash
docker compose up -d --build
# تسطيب cloudflared مرة واحدة (Ubuntu):
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
cloudflared tunnel --url http://localhost:3000
```

هيطبع لينك زي `https://something-random.trycloudflare.com`، ابعته لهاني.

### الطريقة (ب): لينك ثابت — Render (من الـ`render.yaml`)

- شغال حتى لو جهازك مقفول.
- الخطة المجانية: السيرفر **بينام بعد 15 دقيقة من غير زوار**، فأول فتحة بعدها بتاخد حوالي دقيقة.
- الداتابيز المجانية **بتتمسح بعد 30 يوم**. ده كفاية للعرض المؤقت، ومش للـproduction.

**الخطوات:**

1. اعمل push لآخر نسخة على GitHub.
2. ادخل [render.com](https://render.com) وسجّل بحساب GitHub.
3. **New → Blueprint** واختار الريبو `Experts-Live-LandingPage`.
4. Render هيقرا `render.yaml` ويعمل الـweb service والداتابيز. دوس **Apply**.
5. لما يخلص، اللينك هيبقى زي `https://elksa-landing.onrender.com`.
6. لو اللينك طلع مختلف، غيّر `NEXT_PUBLIC_SITE_URL` في الـEnvironment بتاع الـservice، وبعدين **Manual Deploy**.

## 3. قبل الـproduction الحقيقي

شوف قسم «مطلوب وقت الـdeploy» في `docs/TEST-REPORT.md`: HTTPS و HSTS، والدومين، و`IP_HASH_SALT`، والـbackup.

## 4. النشر على سيرفر الشركة

الموقع: **https://global.expertslive.sa/speakerreg**. كل حاجة على السيرفر شغالة باليوزر `mohamed` **من غير sudo**، ومن غير Docker ولا systemd.

```
المتصفح → Caddy (handle /speakerreg* → 127.0.0.1:4195، من غير ما يشيل الـprefix)
        → node server.js في ~/apps/speakerreg/app   (بيشغّله ctl.sh)
        → PostgreSQL 17 خاص بينا على 127.0.0.1:4196
```

### اللي على السيرفر

السكريبت `speakerreg-user-setup.sh` اتشغّل مرة واحدة وعمل الآتي:

| المسار | إيه هو |
|---|---|
| `~/apps/speakerreg/app/` | الـrelease اللي `scripts/deploy.sh` بيرفعه. **أي حاجة تانية هنا بتتمسح مع كل deploy** (`rsync --delete`) |
| `~/apps/speakerreg/ctl.sh` | `start` · `stop` · `restart` · `status` · `logs [عدد السطور]` |
| `~/apps/speakerreg/speakerreg.env` | `DATABASE_URL` و`IP_HASH_SALT` و`PORT=4195` و`HOSTNAME=127.0.0.1` و`TRUSTED_PROXY_HOPS=1`… (`chmod 600`، **مش في git**) |
| `~/apps/speakerreg/pgdata/` | داتا PostgreSQL الخاص بينا (على `127.0.0.1:4196` بس، مش من برّه السيرفر) |
| `~/apps/speakerreg/logs/` | `app.log` و`pg.log` و`cron.log`. أي ملف يعدّي 10 MB بيتنقل لـ`.1` |

- **`ctl.sh start`** بيشغّل PostgreSQL لو كان واقف، وبعدين `node scripts/migrate.mjs` (الـmigrations بتتطبّق لوحدها)، وبعدين `node server.js`. لو التطبيق شغال أصلًا، مبيعملش حاجة.
- **الـcrontab (watchdog):** `@reboot` وكمان كل دقيقتين بيشغّل `ctl.sh start`. يعني لو السيرفر عمل restart أو التطبيق وقع، بيقوم لوحده خلال دقيقتين.
- **من الأدمن:** محتاجين منه بلوك Caddy بس، جوّه موقع `global.expertslive.sa`:
  ```
  handle /speakerreg* {
      reverse_proxy 127.0.0.1:4195
  }
  ```

### النشر (أول مرة وكل تحديث)

من اللابتوب، بعد أي merge على `main`:

```bash
git checkout main && git pull
scripts/deploy.sh
```

السكريبت بيعمل:
1. `pnpm release`
2. `rsync -az --delete --exclude '.next/cache' release/ mohamed@37.221.197.80:apps/speakerreg/app/`
3. `~/apps/speakerreg/ctl.sh restart`، وبعدين يكلّم `http://127.0.0.1:4195/speakerreg/api/health`

لو أي خطوة فشلت، بيقف ويطبع **DEPLOY FAILED** ومكان الغلطة. محتاج بس إن الدخول بالـSSH key يكون شغال (`ssh mohamed@37.221.197.80 'echo ok'`).

**الرجوع لنسخة قديمة:** `git checkout <commit>` وبعدين `scripts/deploy.sh`، وبعدين ارجع لـ`main`.

### المتابعة (على السيرفر)

```bash
ssh mohamed@37.221.197.80
~/apps/speakerreg/ctl.sh status          # postgres و app شغالين؟ + الـhealth
~/apps/speakerreg/ctl.sh logs 200        # آخر 200 سطر من app.log
tail -n 50 ~/apps/speakerreg/logs/pg.log     # logs الداتابيز
tail -n 20 ~/apps/speakerreg/logs/cron.log   # الـwatchdog
crontab -l                               # سطرين ctl.sh start (@reboot و */2)
cat ~/apps/speakerreg/app/release.json   # أنهي commit متنشر دلوقتي
```

**إيقاف حقيقي:** `ctl.sh stop` لوحده مش كفاية، لأن الـwatchdog هيشغّله تاني خلال دقيقتين. علّق سطور `ctl.sh` في `crontab -e` الأول، وبعدين `ctl.sh stop`. وعشان ترجّعه: شيل التعليق، و`ctl.sh start`.

### Export الطلبات والـbackup

الداتابيز بتاعتنا، فنقدر نعمل export من غير الأدمن. الأوامر دي بتقرا `DATABASE_URL` من ملف الـenv جوّه subshell، فمبتسيبش الباسورد في الـshell:

```bash
# CSV بكل الطلبات
( set -a; . ~/apps/speakerreg/speakerreg.env; set +a
  /usr/lib/postgresql/17/bin/psql "$DATABASE_URL" -c "\copy (SELECT * FROM speaker_applications ORDER BY created_at DESC) TO STDOUT CSV HEADER" ) > ~/speakers-$(date +%F).csv

# backup كامل للداتابيز
( set -a; . ~/apps/speakerreg/speakerreg.env; set +a
  /usr/lib/postgresql/17/bin/pg_dump "$DATABASE_URL" -Fc ) > ~/speakerreg-$(date +%F).dump
```

وبعدين نزّل الملف على جهازك: `scp mohamed@37.221.197.80:speakers-YYYY-MM-DD.csv .`

- `psql` و`pg_dump` المفروض يكونوا موجودين جنب `initdb` في `/usr/lib/postgresql/17/bin/` (من الباكدج `postgresql-client-17`). لسه ما اتأكدناش منهم على السيرفر.
- **الـbackup مسؤوليتنا:** دي instance خاصة، والـbackup بتاع الأدمن مش بيغطيها. اعمل `pg_dump` بشكل دوري، أو ضيفه في الـcrontab.

### ملاحظات

- `NEXT_PUBLIC_SITE_URL` والـbasePath بيتحطّوا وقت الـbuild، فأي تغيير فيهم محتاج `scripts/deploy.sh` تاني. لو حبيت تغيّرهم: `RELEASE_SITE_URL=… RELEASE_BASE_PATH=… scripts/deploy.sh`، والـbasePath لازم يطابق بلوك Caddy.
- الـ`.env` اللي على اللابتوب **مش بيترفع**. `pnpm release` بيمسح الـ`.env` اللي Next بينسخه، وبيرفض يكمّل لو لقى أي ملف `.env`. إعدادات السيرفر في `speakerreg.env` بس.
- `ctl.sh` بيستخدم lock، فالـwatchdog والـdeploy مش هيشغّلوا نسختين من التطبيق في نفس الوقت.
