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

## إنشاء OAuth App ورمز المستودع

1. سجّل الدخول إلى حساب GitHub المالك للموقع.
2. افتح **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. أدخل الاسم `Mohamed Elbahdli Portfolio CMS`.
4. اجعل **Homepage URL** عنوان موقعك المنشور: `https://civil-eng-mohamedelbahdli.github.io/civil-eng-mohamedelbahdli/`.
5. اجعل **Authorization callback URL** `https://portfolio-decap-oauth.eng-mohamedelbahdli.workers.dev/callback`.
6. أنشئ التطبيق واحفظ **Client ID** و**Client Secret** مؤقتًا في مكان خاص وآمن. لا ترسلهما في محادثة ولا تضعهما في Git.
7. لا توافق على صلاحية `public_repo`: الـWorker يطلب `read:user` للتحقق من اسم المستخدم فقط، ويستخدم Fine-grained token منفصلًا للحفظ.

## إنشاء Fine-grained token محدود بالمستودع

1. في GitHub افتح **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. سمّه `Portfolio Decap CMS`، واختر المالك `civil-eng-mohamedelbahdli`، وحدد انتهاءً زمنيًا مناسبًا.
3. في **Repository access** اختر **Only select repositories** ثم اختر `civil-eng-mohamedelbahdli`.
4. في **Repository permissions** اجعل **Contents** على **Read and write**. اترك بقية الصلاحيات دون منح؛ **Metadata** للقراءة يضاف تلقائيًا.
5. أنشئ الرمز وانسخه مباشرة إلى Secret في Cloudflare في الخطوات التالية. لا ترسله في محادثة أو تحفظه في ملف.

## نشر OAuth Worker مجانًا على Cloudflare

يعمل الـWorker على الخطة المجانية وعنوان `workers.dev`، ولا يحتاج إلى دومين مدفوع.

1. أنشئ حساب Cloudflare مجانيًا، ومن مجلد المشروع افتح Terminal وشغّل:

   ```powershell
   npx wrangler login
   npx wrangler deploy --config cloudflare-worker/wrangler.toml
   ```

   وافق على ربط Wrangler بحسابك. سيظهر عنوان Worker من الشكل `https://portfolio-decap-oauth.<account-subdomain>.workers.dev`.

2. حدّث **Homepage URL** و**Authorization callback URL** في GitHub OAuth App بالقيم الفعلية، مع إضافة `/callback` للأخيرة.
3. من Worker → **Settings → Variables and Secrets** خزّن `GITHUB_OAUTH_SECRET` و`GITHUB_REPO_TOKEN` كـ**Secrets**. `GITHUB_OAUTH_ID` متغير عادي. لا تضع أيًا منها في ملفات المشروع.

4. من لوحة Cloudflare افتح Worker `portfolio-decap-oauth` ثم **Settings → Variables and Secrets → Variables** وأضف `ALLOWED_GITHUB_USERNAME` بالقيمة `civil-eng-mohamedelbahdli`. هذا هو اسم مستخدم GitHub المسموح الوحيد. احفظ التغيير وأعد نشر/تشغيل Worker إذا طلبت Cloudflare ذلك. المتغير `ALLOWED_SITE_ORIGIN` يظل `https://civil-eng-mohamedelbahdli.github.io`، أي النطاق فقط من دون مسار المستودع.
5. عند الاختبار المحلي اجعل `ALLOWED_SITE_ORIGIN` عنوان المعاينة المحلي فقط؛ قبل النشر أعده إلى `https://civil-eng-mohamedelbahdli.github.io`.
6. انسخ عنوان Worker الحقيقي إلى `backend.base_url` في `admin/config.yml` (من دون `/auth` أو `/callback`). اجعل `backend.branch` يساوي `main` للنشر الحي.
7. الـWorker يرفض أي حساب عدا `civil-eng-mohamedelbahdli`، ولا يسلّم للوحة الإدارة إلا Fine-grained token المحصور بالمستودع المحدد.

## الصور

تُرفع الصور إلى `assets/images/`. الحد الأقصى 3 MiB للصورة؛ ويحوّلها Decap في المتصفح إلى WebP، يزيل بيانات EXIF، ويقلّص العرض إلى 1600px بجودة 82 قبل الحفظ. للتحكم اليدوي قبل الرفع، استخدم Squoosh أو أداة صور موثوقة: اختر WebP أو JPEG، قلّل العرض إلى 1600px كحد أعلى، واضبط الجودة بين 75 و85 حتى يصبح الملف أصغر من 3 MiB. راجع الصورة بعد الضغط قبل حفظها.

## الاستعادة المحلية

فرع `pre-dashboard` عند commit `04ff20c` يحفظ تعديلاتك قبل لوحة الإدارة. للرجوع، أنشئ فرعًا جديدًا من تلك النقطة أو أعد فتحها من سجل Git؛ لا تحذف ملفات المحتوى بعد النشر قبل تنزيل نسخة منها.
