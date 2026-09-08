// ===== Language toggle (AR / EN) =====
const translatable = document.querySelectorAll('[data-ar][data-en]');
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;

function applyLang(lang) {
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';

  translatable.forEach(el => {
    el.textContent = el.dataset[lang];
  });
}

langToggle.addEventListener('click', () => {
  const next = html.lang === 'ar' ? 'en' : 'ar';
  applyLang(next);
});


// ===== Booking form =====

const GOOGLE_SCRIPT_URL = ''; 
// حط هنا رابط Google Apps Script بعد ما تعمله Deploy

const WHATSAPP_NUMBER = '201095442559';
// رقم مستر يوسف بصيغة دولية بدون + أو مسافات
// 01095442559 → 201095442559

const form = document.getElementById('bookingForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isAr = html.lang === 'ar';
  const submitBtn = form.querySelector('button[type="submit"]');

  const data = Object.fromEntries(new FormData(form).entries());

  // تحويل قيم المرحلة للعربي
  const stageNames = {
    primary: 'ابتدائي',
    middle: 'إعدادي',
    high: 'ثانوي'
  };

  // تحويل قيم السنتر للعربي
  const centerNames = {
    top: 'Top Center',
    eman: 'El-Eman Center',
    tamayuz: 'El-Tamayuz Center'
  };

  const stage = stageNames[data.stage] || data.stage;
  const center = centerNames[data.center] || data.center;

  // ===== رسالة WhatsApp =====
  const message =
`📚 حجز طالب جديد

👤 الاسم: ${data.name}
📱 رقم الهاتف: ${data.phone}
🎓 المرحلة الدراسية: ${stage}
🏫 السنتر المفضل: ${center}
📝 ملاحظات: ${data.notes || 'لا توجد'}

تم إرسال البيانات من موقع مستر يوسف هشام.`;

  // ===== رابط WhatsApp =====
  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


  // ===== إرسال البيانات إلى Google Sheet =====
  if (GOOGLE_SCRIPT_URL) {

    submitBtn.disabled = true;
    status.textContent = isAr
      ? 'جاري إرسال الحجز...'
      : 'Sending...';

    try {

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      status.textContent = isAr
        ? 'تم إرسال الحجز، جاري فتح WhatsApp...'
        : 'Booking sent, opening WhatsApp...';

      form.reset();

      // فتح WhatsApp
      window.location.href = whatsappURL;

    } catch (err) {

      status.textContent = isAr
        ? 'حصل خطأ أثناء إرسال البيانات'
        : 'Something went wrong while sending the booking';

    } finally {
      submitBtn.disabled = false;
    }

  } else {

    // لو Google Sheet مش متظبط، افتح WhatsApp مباشرة
    status.textContent = isAr
      ? 'جاري فتح WhatsApp...'
      : 'Opening WhatsApp...';

    form.reset();

    window.location.href = whatsappURL;
  }
});