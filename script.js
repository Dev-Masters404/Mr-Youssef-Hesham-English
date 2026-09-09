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

// ===== Booking form -> WhatsApp =====
const WHATSAPP_NUMBER = '201095442559';

const stageLabels = {
  primary: { ar: 'ابتدائي', en: 'Primary' },
  middle:  { ar: 'إعدادي', en: 'Middle' },
  high:    { ar: 'ثانوي', en: 'High school' }
};
const centerLabels = {
  top: 'Top Center',
  eman: 'El-Eman Center',
  tamayuz: 'El-Tamayuz Center'
};
const modeLabels = {
  center:  { ar: 'في السنتر', en: 'At the center' },
  online:  { ar: 'أونلاين', en: 'Online' },
  private: { ar: 'برايفت', en: 'Private' }
};

const modeSelect = document.getElementById('mode');
const centerField = document.getElementById('centerField');
const centerSelect = document.getElementById('center');

function toggleCenterField() {
  const isCenter = modeSelect.value === 'center';
  centerField.style.display = isCenter ? '' : 'none';
  centerSelect.required = isCenter;
  if (!isCenter) centerSelect.value = '';
}
modeSelect.addEventListener('change', toggleCenterField);
toggleCenterField();

const form = document.getElementById('bookingForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isAr = html.lang === 'ar';
  const data = Object.fromEntries(new FormData(form).entries());
  const stage = stageLabels[data.stage] ? stageLabels[data.stage][isAr ? 'ar' : 'en'] : data.stage;
  const mode = modeLabels[data.mode] ? modeLabels[data.mode][isAr ? 'ar' : 'en'] : data.mode;
  const center = data.mode === 'center' ? (centerLabels[data.center] || data.center) : null;

  const lines = isAr
    ? [
        'مرحبًا مستر يوسف، عايز أحجز مكان في كورس اللغة الإنجليزية.',
        `الاسم: ${data.name}`,
        `رقم الهاتف: ${data.phone}`,
        `المرحلة: ${stage}`,
        `نظام الحضور: ${mode}`,
        center ? `السنتر: ${center}` : null,
        data.notes ? `ملاحظات: ${data.notes}` : null
      ]
    : [
        "Hello Mr. Youssef, I'd like to book a spot in the English course.",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Stage: ${stage}`,
        `Attendance type: ${mode}`,
        center ? `Center: ${center}` : null,
        data.notes ? `Notes: ${data.notes}` : null
      ];

  const message = lines.filter(Boolean).join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
});