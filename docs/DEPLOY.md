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

الموقع: **https://global.expertslive.sa/speakerreg**. السيرفر عليه Node 22 و PostgreSQL 17 و Caddy، ومن غير Docker.

```
المتصفح → Caddy (handle /speakerreg* → 127.0.0.1:4195، من غير ما يشيل الـprefix)
        → systemd service «speakerreg» → node server.js في /opt/speakerreg/app
```

- الـbuild بيحصل على اللابتوب (Linux x64، نفس معمارية السيرفر)، وبيترفع جاهز. مفيش `pnpm install` ولا build على السيرفر.
- `pnpm release` بيعمل build بـ`NEXT_PUBLIC_SITE_URL=https://global.expertslive.sa/speakerreg` و`basePath=/speakerreg`، ويجمّع فولدر `release/` فيه: `server.js` والـ`node_modules` اللازمة بس، و`public` و`.next/static`، و`db/migrations` و`scripts/migrate.mjs`، و`release.json` (الـcommit ووقت الـbuild). **من غير `.env`** ومن غير كود المصدر.
- الـservice بيشغّل `node scripts/migrate.mjs` الأول، وبعدين `node server.js`. يعني الـmigrations بتتطبّق لوحدها مع كل restart.

### المطلوب من الأدمن (مرة واحدة)

- داتابيز ويوزر لـPostgreSQL.
- ملف env للـroot بس، فيه:
  - `DATABASE_URL=postgres://USER:PASS@127.0.0.1:5432/DB`
  - `IP_HASH_SALT=` (قيمة عشوائية طويلة: `openssl rand -hex 32`)
  - `TRUSTED_PROXY_HOPS=1` (Caddy هو الـproxy الوحيد)
  - `PORT=4195`
  - `HOSTNAME=127.0.0.1`
  - `NODE_ENV=production`
- الـservice `speakerreg` وبلوك Caddy:
  ```
  handle /speakerreg* {
      reverse_proxy 127.0.0.1:4195
  }
  ```
- اليوزر `mohamed` يقدر يكتب في `/opt/speakerreg/app/`، ويقدر يشغّل بـ`sudo` من غير باسورد: `systemctl restart|status speakerreg` و`journalctl -u speakerreg`.

### أول نشر

```bash
ssh mohamed@37.221.197.80 'echo ok'     # اتأكد إن الدخول بالـSSH key شغال
scripts/deploy.sh
```

السكريبت بيعمل `pnpm release`، وبعدين `rsync --delete` لـ`release/` على `/opt/speakerreg/app/`، وبعدين `restart` للـservice، وبيكلّم `/speakerreg/api/health` على السيرفر. لو أي خطوة فشلت بيقف ويطبع **DEPLOY FAILED** ومكان الغلطة.

### التحديث

بعد أي merge على `main`:

```bash
git checkout main && git pull
scripts/deploy.sh
```

**الرجوع لنسخة قديمة:** `git checkout <commit>` وبعدين `scripts/deploy.sh`، وبعدين ارجع لـ`main`.

### المتابعة

```bash
ssh mohamed@37.221.197.80
sudo systemctl status speakerreg --no-pager          # الحالة
sudo journalctl -u speakerreg --no-pager -n 200      # آخر 200 سطر logs
cat /opt/speakerreg/app/release.json                 # أنهي commit متنشر دلوقتي
curl -fsS http://127.0.0.1:4195/speakerreg/api/health
```

### ملاحظات

- `NEXT_PUBLIC_SITE_URL` والـbasePath بيتحطّوا وقت الـbuild، فأي تغيير فيهم محتاج `scripts/deploy.sh` تاني. لو حبيت تغيّرهم: `RELEASE_SITE_URL=… RELEASE_BASE_PATH=… scripts/deploy.sh`، والـbasePath لازم يطابق بلوك Caddy.
- الـ`.env` اللي على اللابتوب **مش بيترفع**. Next بينسخه جوّه `.next/standalone`، و`pnpm release` بيمسحه وبيرفض يكمّل لو لقى أي ملف `.env`.
- `rsync --delete` بيمسح أي حاجة في `/opt/speakerreg/app/` مش موجودة في `release/`، فما تحطّش أي ملفات تانية في الفولدر ده.

### Export الطلبات (open item)

`mohamed` ما عندوش `psql` على السيرفر. لحد ما يتحل:
- اطلب من الأدمن export لجدول `speaker_applications`، مثلًا:
  ```bash
  sudo -u postgres psql -d DB -c "\copy (SELECT * FROM speaker_applications ORDER BY created_at DESC) TO STDOUT CSV HEADER" > speakers.csv
  ```
- أو نعمل بعدين صفحة admin محمية فيها زرار export.
