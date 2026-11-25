# Deploy — Docker والنشر المؤقت

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

## 4. Deploy on company server

الموقع هيشتغل على **https://global.expertslive.sa/speakerreg**، ورا الـnginx الموجود على سيرفر Debian.

**الفكرة:**
- الأبلكيشن متعمل build بـ`basePath` قيمته `/speakerreg`، يعني كل الصفحات والصور والـAPI بتبدأ بـ`/speakerreg`.
- nginx بيبعت `location /speakerreg` زي ما هو (من غير ما يغيّر الـpath) لـ`127.0.0.1:3010`.
- البورت `3010` مفتوح على `127.0.0.1` بس، والداتابيز مش مفتوحة برّه الـcontainers خالص.

**أول مرة:**

```bash
git clone https://github.com/mohamedabdullah999/Call-For-Professionals.git speakerreg
cd speakerreg
cp .env.production.example .env
openssl rand -hex 24   # حطّه في POSTGRES_PASSWORD
openssl rand -hex 32   # حطّه في IP_HASH_SALT
nano .env && chmod 600 .env

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps   # web لازم يبقى healthy
curl -I http://127.0.0.1:3010/speakerreg                             # 307 → /speakerreg/ar أو /en
```

**nginx:** انسخ محتوى `deploy/nginx-speakerreg.conf` جوّه بلوك `server` بتاع `global.expertslive.sa` (بتاع HTTPS)، وبعدين:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

**تحديث بعد أي merge على main:**

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

الـmigrations بتشتغل لوحدها مع كل تشغيل للـcontainer.

**ملاحظات:**
- `NEXT_PUBLIC_SITE_URL` و`NEXT_PUBLIC_BASE_PATH` بيتقروا وقت الـ**build**. لو غيّرت أي واحد فيهم لازم `--build` تاني، وقيمة `NEXT_PUBLIC_BASE_PATH` لازم تطابق الـ`location` في nginx.
- خلّي اسم الملف `.env`، لأنه متجاهَل في git وفي Docker. ما تعملش `.env.production`.
- `POSTGRES_PASSWORD` بيدخل جوّه URL، فخلّيه حروف وأرقام بس (`openssl rand -hex` بيطلّع كده).
- Export للطلبات: `docker compose -f docker-compose.yml -f docker-compose.prod.yml exec -T db psql -U elksa -d elksa_landing -c "\copy (SELECT * FROM speaker_applications ORDER BY created_at DESC) TO STDOUT CSV HEADER" > speakers.csv`
- الـlogs: `docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web` (كل ملف log أقصاه 10 MB).
- الـrate limit بيعتمد على `X-Forwarded-For` اللي nginx بيضيفه (`TRUSTED_PROXY_HOPS=1`). لو اتحط CDN أو proxy تاني قدّام nginx، زوّد الرقم.

