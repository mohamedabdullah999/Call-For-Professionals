import type { Content } from './types';

const ar: Content = {
  locale: 'ar',
  dir: 'rtl',
  meta: {
    title: 'دعوة للخبراء والمتخصصين | إكسبيرتس لايف السعودية 2026، 29–30 نوفمبر، الرياض',
    description:
      'دعوة للخبراء والمتخصصين: قدّم للمشاركة متحدثًا في إكسبيرتس لايف السعودية 2026، يومي 29–30 نوفمبر في مركز المؤتمرات بجامعة الأميرة نورة بنت عبدالرحمن، الرياض. شاركنا خبرتك والموضوعات التي يمكنك الحديث عنها.',
    ogLocale: 'ar_SA',
  },
  a11y: {
    skip: 'انتقل إلى المحتوى',
    menuOpen: 'افتح القائمة',
    menuClose: 'أغلق القائمة',
    primaryNav: 'القائمة الرئيسية',
    switchLanguage: 'Read this page in English',
    opensNewTab: '(يفتح في تبويب جديد)',
    pnuLogo: 'جامعة الأميرة نورة بنت عبدالرحمن',
    elksaLogo: 'إكسبيرتس لايف السعودية',
    homeLink: 'إكسبيرتس لايف السعودية، العودة إلى الأعلى',
  },
  nav: [
    { label: 'قدّم كمتحدث', href: '#apply' },
    { label: 'البرنامج', href: '#programme' },
    { label: 'الشركاء', href: '#partners' },
  ],
  langSwitch: { label: 'English', href: '/en', lang: 'en' },
  ctaApply: 'قدّم كمتحدث',
  hero: {
    kicker: 'إكسبيرتس لايف السعودية 2026',
    titleLines: ['دعوة للخبراء', 'والمتخصصين'],
    lead: 'في إكسبيرتس لايف السعودية 2026، تعرض الشركات الناشئة أفكارها أمام المستثمرين.',
    // TBC: Arabic tagline not in the official kit
    tagline: 'تعلّم. شارك. قُد.',
    dateLabel: 'الموعد',
    date: '\u206629–30\u2069 نوفمبر 2026',
    days: 'الأحد والاثنين',
    venueLabel: 'المكان',
    venue: 'مركز المؤتمرات، جامعة الأميرة نورة بنت عبدالرحمن، الرياض',
  },
  countdown: {
    live: 'المؤتمر منعقد الآن',
    over: 'شكرًا لحضوركم',
    daysToGo: { one: 'تبدأ غدًا', two: 'باقي يومان', few: 'باقي {n} أيام', many: 'باقي {n} يومًا' },
  },
  facts: [
    { value: '1,000+', label: 'من الحضور' },
    { value: '500+', label: 'من القيادات التنفيذية وقادة الاقتصاد الرقمي' },
    { value: '55+', label: 'متحدثًا' },
    { value: '16', label: 'دولة يمثّلها المتحدثون' },
    { value: '6', label: 'مسارات' },
    { value: '8', label: 'قاعات للورش التطبيقية' },
  ],
  apply: {
    label: 'دعوة للخبراء والمتخصصين',
    heading: 'قدّم للمشاركة متحدثًا في إكسبيرتس لايف السعودية 2026',
    intro:
      'عرّفنا بنفسك وبتخصصك وبالموضوعات التي يمكنك المشاركة بها من مجالات المؤتمر. تجد المسارات الستة في أسفل الصفحة.',
    stepsHeading: 'كيف تتم العملية',
    // TBC: selection process and reply timing not confirmed by the organiser
    steps: ['أرسل طلبك عبر النموذج.', 'يراجعه فريق التنظيم.', 'نتواصل معك بالخطوات التالية.'],
  },
  form: {
    heading: 'قدّم كمتحدث',
    intro: 'جميع الحقول مطلوبة.',
    fields: {
      fullName: { label: 'اسم المتحدث' },
      jobTitle: { label: 'المنصب' },
      expertise: { label: 'التخصص' },
      company: { label: 'الشركة الحالية' },
      linkedinUrl: {
        label: 'رابط حساب لينكدإن',
        placeholder: 'https://www.linkedin.com/in/your-name',
        hint: 'رابط صفحتك العامة في لينكدإن.',
      },
      bio: {
        label: 'نبذة مختصرة عنك والموضوعات التي يمكنك المشاركة بها من مجالات المؤتمر',
        hint: 'من \u206650\u2069 إلى \u20661,500\u2069 حرف.',
      },
    },
    counter: {
      belowMin: 'المتبقي للوصول إلى الحد الأدنى: {n}',
      count: '\u2066{n} / {max}\u2069 حرف',
    },
    submit: 'أرسل الطلب',
    sending: 'جارٍ الإرسال…',
    successTitle: 'وصل طلبك',
    successBody: 'شكرًا لك. حفظنا طلبك وسيراجعه فريق التنظيم.',
    sendAnother: 'أرسل طلبًا آخر',
    // TBC: link to a privacy policy once one exists
    privacyNote: 'نستخدم هذه البيانات لمراجعة طلب مشاركتك متحدثًا والتواصل معك بخصوصه فقط.',
    errors: {
      required: 'املأ هذا الحقل.',
      tooShort: 'عدد الأحرف أقل من الحد الأدنى ({min}).',
      tooLong: 'اجعل النص أقل من {max} حرفًا.',
      linkedin: 'اكتب رابط حسابك في لينكدإن، مثل \u2066https://www.linkedin.com/in/your-name\u2069',
      summary: 'بعض الحقول تحتاج إلى مراجعة.',
      network: 'تعذّر الإرسال. تحقّق من اتصالك وحاول مرة أخرى.',
      rateLimited: 'محاولات كثيرة من هذا الاتصال. انتظر دقيقة ثم حاول مرة أخرى.',
      server: 'تعذّر حفظ بياناتك. حاول مرة أخرى أو راسلنا على hany@expertslive.sa.',
    },
  },
  superNourah: {
    time: '10:30',
    when: 'اليوم الأول، القاعة الحمراء (Red Hall)',
    heading: 'الكشف عن سوبر نورة مباشرة',
    body: 'تكشف جامعة الأميرة نورة بنت عبدالرحمن عن «سوبر نورة»، أول حاسوب فائق للأبحاث في المنطقة، مباشرة على مسرح إكسبيرتس لايف السعودية.',
  },
  programme: {
    heading: 'ستة مسارات عن الاقتصاد الرقمي',
    intro: 'كلمات افتتاحية وجلسات حوارية على المسرح الرئيسي، ثم ستة مسارات متوازية وثماني قاعات للورش التطبيقية بمستوى \u2066300–400\u2069.',
    tracks: [
      { name: 'الذكاء الاصطناعي', topics: 'الذكاء الاصطناعي التوليدي، ووكلاء الذكاء الاصطناعي، وتبنّيه' },
      { name: 'السحابة والحوسبة الفائقة النطاق', topics: 'هندسة السحابة، والسحابة المتعددة، والترحيل' },
      { name: 'الحوكمة والأمن', topics: 'الحوكمة، والأمن السيبراني، والهوية، والامتثال' },
      { name: 'البيانات وإنترنت الأشياء', topics: 'منصات البيانات، وإنترنت الأشياء والأجهزة الذكية، والتحليلات' },
      { name: 'الأتمتة', topics: 'الأتمتة، والتجربة الرقمية، والاقتصاد الرقمي' },
      { name: 'إدارة الأجهزة الطرفية', topics: 'بيئة العمل الحديثة، وأمن الأجهزة الطرفية' },
    ],
  },
  speakers: {
    heading: 'أكثر من 55 متحدثًا من 16 دولة',
    intro: 'قيادات سعودية وخبراء عالميون وحاملو لقب Microsoft MVP. نخبة منهم:',
    hostLabel: 'المستضيف',
    mcLabel: 'مقدّمة الحفل في اليومين',
    mc: 'د. أثير المطيري',
    // TBC: official Arabic spellings of speaker names and titles. Names stay in Latin until provided.
    list: [
      { name: 'Prof. Hanan Aljuaid', role: 'Director, AI for Healthcare Research Chair, PNU' },
      { name: 'Dr Manal Alassaf', role: 'SVP Marketplace, HUMAIN' },
      { name: 'Dr Mona Al-Muheid', role: 'VP Data & AI Models, Healthcare, HUMAIN' },
      { name: 'Zainab Alamin', role: 'VP National Digital Transformation, Microsoft' },
      { name: 'Prof. Sara Alotaibi', role: 'Senior Advisor, RDIA' },
      { name: 'Dr. Fatimah Alakeel', role: 'Cybersecurity & AI Executive' },
      { name: 'Dr. Abdullah Altaf', role: 'Cloud Architect R&D, SDAIA' },
      { name: 'Dr Mohammed Dighriri', role: 'NCEC' },
      { name: 'Ahmed Gamal', role: 'VAST Data' },
      { name: 'Leon Gordon', role: 'Onyx Data' },
      { name: 'Hazem Ali', role: 'Skytells' },
      { name: 'Majd Aldeen Masriah', role: 'Geidea' },
      { name: 'Mohamed Mortadha Manai', role: 'Netflix' },
    ],
    all: 'كل المتحدثين',
  },
  partners: {
    heading: 'بالشراكة مع',
    groupTitle: 'التنظيم',
  },
  partnerCta: {
    heading: 'ادعُ عملاءك، والتقِ بهم في جناحك.',
    body: 'كن شريكًا لإكسبيرتس لايف السعودية، وضع فريقك أمام أكثر من 1,000 زائر، منهم أكثر من 500 من القيادات التنفيذية وقادة الاقتصاد الرقمي.',
  },
  footer: {
    line: 'Experts Live Saudi · PNU, Riyadh · 29–30 Nov 2026 · Presented by ZAT.VC & Cloud Mechanics · In partnership with Microsoft, MCIT, PNU & AI Chair',
    contact: 'تواصل معنا',
    website: 'الموقع الرئيسي',
    registration: 'التسجيل',
    rights: '© 2026 إكسبيرتس لايف السعودية',
  },
  mobileBar: { text: '\u206629–30\u2069 نوفمبر، الرياض' },
  notFound: {
    heading: 'هذه الصفحة غير موجودة',
    body: 'ربما الرابط قديم أو فيه خطأ.',
    back: 'اذهب إلى صفحة إكسبيرتس لايف السعودية',
  },
};

export default ar;
