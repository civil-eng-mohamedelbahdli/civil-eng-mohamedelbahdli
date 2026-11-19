# إدارة محتوى الموقع

## لوحة الإدارة

افتح `/admin/` على الموقع المنشور وسجّل الدخول بحساب GitHub المسموح. احفظ التعديلات من زر النشر داخل Decap CMS؛ كل حفظ ينشئ commit في فرع `main`، ثم ينشر GitHub Pages التغيير عادةً خلال دقيقة أو دقيقتين. لا تضع Client Secret أو أي رمز دخول في ملفات المشروع.

من لوحة الإدارة:

- عدّل المشاريع والخبرات والمدونة من قائمة **المحتوى**. اسحب العناصر لتغيير ترتيبها، وأوقف خيار الظهور لإخفائها دون حذفها.
- في المشروع، اختر صورة غلاف ثم أضف الصور إلى المعرض؛ رتّب الصور بالسحب واكتب وصفًا بديلًا لكل صورة. حقول بيانات المشروع مفردة لتجنب تكرار الدور أو نوع المشروع.
- المقالات لا تظهر للعامة إلا بعد تفعيل **منشور للعامة**. رابط Blog يظهر في التنقل بعد نشر مقال واحد.
- غيّر عناوين التصنيفات من **إعدادات الموقع**. استخدم معرّف التصنيف الإنجليزي نفسه في حقل تصنيف المشروع.

## تجهيز GitHub Pages

1. ارفع فرع `dashboard` إلى GitHub وافتح Pull Request إلى `main`، ثم ادمجه بعد مراجعة التغييرات. فرع `pre-dashboard` يحتفظ بنسخة الرجوع التي أُنشئت قبل التعديلات.
2. في GitHub افتح **Settings → Pages** وتأكد أن النشر من `main` ومجلد الجذر `/`. عنوان المشروع المتوقع هو `https://civil-eng-mohamedelbahdli.github.io/civil-eng-mohamedelbahdli/`.

## إنشاء OAuth App على GitHub

1. سجّل الدخول إلى حساب GitHub المالك للموقع.
2. افتح **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. أدخل اسمًا مثل `Mohamed Portfolio CMS`.
4. اجعل **Homepage URL** عنوان Worker الذي سيظهر بعد نشره في الخطوة التالية.
5. اجعل **Authorization callback URL** عنوان Worker نفسه متبوعًا بـ `/callback`، مثل `https://worker-name.account-subdomain.workers.dev/callback`.
6. أنشئ التطبيق واحفظ **Client ID** و**Client Secret** مؤقتًا في مدير كلمات مرور. لا ترسلهما في محادثة ولا تضعهما في Git.
7. إذا ظهر خيار **Expire user authorization tokens**، عطّله لهذا التطبيق؛ تدفق Decap/Worker الحالي يتبادل ويرسل access token فقط ولا يجدّد refresh tokens. GitHub توصي عادةً بالرموز المنتهية، لذا أعد تسجيل الدخول عند إبطال الرمز، وألغِ تفويض التطبيق من إعدادات الحساب إذا لم تعد تستخدمه.

## نشر OAuth Worker مجانًا على Cloudflare

يعمل الـWorker على الخطة المجانية وعنوان `workers.dev`، ولا يحتاج إلى دومين مدفوع.

1. أنشئ حساب Cloudflare مجانيًا، ومن مجلد المشروع افتح Terminal وشغّل:

   ```powershell
   npx wrangler login
   npx wrangler deploy --config cloudflare-worker/wrangler.toml
   ```

   وافق على ربط Wrangler بحسابك. سيظهر عنوان Worker من الشكل `https://portfolio-decap-oauth.<account-subdomain>.workers.dev`.

2. حدّث **Homepage URL** و**Authorization callback URL** في GitHub OAuth App بالقيم الفعلية، مع إضافة `/callback` للأخيرة.
3. خزّن بيانات التطبيق كأسرار في Cloudflare، من Terminal نفسه:

   ```powershell
   npx wrangler secret put GITHUB_OAUTH_ID --config cloudflare-worker/wrangler.toml
   npx wrangler secret put GITHUB_OAUTH_SECRET --config cloudflare-worker/wrangler.toml
   ```

   أدخل القيمة عند مطالبة Wrangler بها؛ لن تُكتب في ملفات المشروع.

4. افتح `cloudflare-worker/wrangler.toml` وتأكد أن `ALLOWED_GITHUB_USERNAME` هو اسم مستخدمك الدقيق على GitHub. القيمة الحالية `mohamedelbahdli` مأخوذة من رابط GitHub الموجود في الموقع. تأكد أيضًا أن `ALLOWED_SITE_ORIGIN` يطابق نطاق GitHub Pages دون مسار المستودع.
5. انسخ عنوان Worker الحقيقي إلى `backend.base_url` في `admin/config.yml` (من دون `/auth` أو `/callback`) ثم احفظ التعديل وارفع فرع `dashboard` وادمجه في `main`.
6. بعد نشر GitHub Pages، افتح `/admin/` وسجّل الدخول بحساب GitHub المسموح. الـWorker يرفض أي حساب آخر قبل تسليم access token إلى لوحة الإدارة.

## الصور

تُرفع الصور إلى `assets/images/`. الحد الأقصى 3 MiB للصورة؛ ويحوّلها Decap في المتصفح إلى WebP، يزيل بيانات EXIF، ويقلّص العرض إلى 1600px بجودة 82 قبل الحفظ. للتحكم اليدوي قبل الرفع، استخدم Squoosh أو أداة صور موثوقة: اختر WebP أو JPEG، قلّل العرض إلى 1600px كحد أعلى، واضبط الجودة بين 75 و85 حتى يصبح الملف أصغر من 3 MiB. راجع الصورة بعد الضغط قبل حفظها.

## الاستعادة المحلية

فرع `pre-dashboard` عند commit `04ff20c` يحفظ تعديلاتك قبل لوحة الإدارة. للرجوع، أنشئ فرعًا جديدًا من تلك النقطة أو أعد فتحها من سجل Git؛ لا تحذف ملفات المحتوى بعد النشر قبل تنزيل نسخة منها.
