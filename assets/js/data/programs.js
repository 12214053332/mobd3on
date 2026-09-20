/* Mock data for the training-programs pages — extracted as-is from the prototype
   (COURSE_LIBRARY, EDU_PATHS, instructors/academic pools). Sessions and per-group details are omitted. */
window.MOCK = window.MOCK || {};
MOCK.COURSES = [
 {
  "id": 1,
  "courseId": "CL-001",
  "name": "أساسيات الأمن السيبراني",
  "image": "cyber-cover.jpg",
  "generalDesc": "مدخل شامل إلى مفاهيم الأمن السيبراني وتطبيقاته العملية.",
  "objectives": "فهم أساسيات الأمن السيبراني، وتطبيق ضوابط الحماية الأساسية على الأنظمة والشبكات.",
  "audience": "موظفو تقنية المعلومات والمهتمون بالأمن السيبراني.",
  "features": "محتوى عملي، مدربون معتمدون، شهادة معتمدة عند الإكمال.",
  "topics": "أساسيات الشبكات، التشفير، إدارة المخاطر، الاستجابة للحوادث.",
  "outcomes": "القدرة على تقييم المخاطر الأمنية الأساسية وتطبيق ضوابط الحماية.",
  "faqs": [
   {
    "q": "هل الدورة مناسبة للمبتدئين؟",
    "a": "نعم، الدورة مصممة لتناسب المبتدئين والمهتمين الجدد بالمجال."
   },
   {
    "q": "هل تصدر شهادة معتمدة؟",
    "a": "نعم، تصدر شهادة معتمدة عند إكمال جميع متطلبات الدورة."
   }
  ],
  "specializations": [
   "الأمن السيبراني"
  ],
  "price": "12,000",
  "days": 30,
  "hours": 120,
  "type": "عن بعد",
  "installments": [
   "tabby",
   "tamara"
  ],
  "webVisible": true,
  "editRoles": [
   "admin",
   "academic"
  ],
  "status": "active",
  "updated": "قبل ساعة"
 },
 {
  "id": 2,
  "courseId": "CL-002",
  "name": "مقدمة في الذكاء الاصطناعي",
  "image": null,
  "generalDesc": "مدخل عملي إلى مفاهيم الذكاء الاصطناعي وتطبيقاته.",
  "objectives": "فهم أساسيات الذكاء الاصطناعي وتطبيق نماذج تعلم آلي بسيطة.",
  "audience": "المبتدئون والمهتمون بالتقنية.",
  "features": "أمثلة عملية، مشاريع تطبيقية.",
  "topics": "تعلم الآلة، الشبكات العصبية، معالجة اللغة الطبيعية.",
  "outcomes": "بناء نموذج تعلم آلي بسيط من الصفر.",
  "faqs": [
   {
    "q": "هل أحتاج خبرة برمجية سابقة؟",
    "a": "يُفضّل معرفة أساسية بالبرمجة، لكنها ليست شرطاً."
   }
  ],
  "specializations": [
   "الذكاء الاصطناعي",
   "علم البيانات"
  ],
  "price": "4,500",
  "days": 14,
  "hours": 40,
  "type": "عن بعد",
  "installments": [
   "tabby"
  ],
  "webVisible": true,
  "editRoles": [
   "admin"
  ],
  "status": "active",
  "updated": "أمس"
 },
 {
  "id": 3,
  "courseId": "CL-003",
  "name": "قواعد البيانات المتقدمة",
  "image": null,
  "generalDesc": "تصميم وتحسين قواعد البيانات العلائقية للأنظمة الكبيرة.",
  "objectives": "تحسين أداء الاستعلامات وتصميم مخططات علائقية متقدمة.",
  "audience": "مطورو ومهندسو البرمجيات.",
  "features": "أمثلة من أنظمة حقيقية.",
  "topics": "الفهرسة، تحسين الاستعلامات، التوسع الأفقي.",
  "outcomes": "تصميم قاعدة بيانات محسّنة لتطبيق إنتاجي.",
  "faqs": [],
  "specializations": [
   "هندسة البرمجيات",
   "علم البيانات"
  ],
  "price": "6,000",
  "days": 20,
  "hours": 60,
  "type": "حضوري",
  "installments": [],
  "webVisible": false,
  "editRoles": [
   "admin"
  ],
  "status": "draft",
  "updated": "قبل يومين"
 },
 {
  "id": 4,
  "courseId": "CL-004",
  "name": "الشبكات الآمنة",
  "image": null,
  "generalDesc": "تصميم وتأمين البنية التحتية للشبكات.",
  "objectives": "تطبيق ضوابط أمن الشبكات وتقييم نقاط الضعف.",
  "audience": "مهندسو الشبكات والأمن السيبراني.",
  "features": "مختبرات عملية على بيئات محاكاة.",
  "topics": "جدران الحماية، VPN، تجزئة الشبكات.",
  "outcomes": "تصميم شبكة مؤسسية آمنة من الصفر.",
  "faqs": [],
  "specializations": [
   "الشبكات",
   "الأمن السيبراني"
  ],
  "price": "7,500",
  "days": 18,
  "hours": 70,
  "type": "حضوري",
  "installments": [
   "tabby"
  ],
  "webVisible": true,
  "editRoles": [
   "admin"
  ],
  "status": "active",
  "updated": "قبل 3 أيام"
 },
 {
  "id": 5,
  "courseId": "CL-005",
  "name": "الاستجابة للحوادث الأمنية",
  "image": null,
  "generalDesc": "منهجيات كشف الحوادث الأمنية والاستجابة لها.",
  "objectives": "بناء خطة استجابة للحوادث وتنفيذها عملياً.",
  "audience": "فرق العمليات الأمنية (SOC).",
  "features": "سيناريوهات حوادث واقعية.",
  "topics": "كشف التسلل، التحليل الجنائي الرقمي، خطط التعافي.",
  "outcomes": "قيادة فريق استجابة لحادثة أمنية فعلية.",
  "faqs": [],
  "specializations": [
   "الأمن السيبراني",
   "هندسة البرمجيات"
  ],
  "price": "8,000",
  "days": 15,
  "hours": 50,
  "type": "عن بعد",
  "installments": [
   "tabby",
   "tamara"
  ],
  "webVisible": true,
  "editRoles": [
   "admin"
  ],
  "status": "active",
  "updated": "قبل 4 أيام"
 }
];
MOCK.EDU_PATHS = [
 {
  "id": 1,
  "pathId": "DIP-101",
  "type": "diploma",
  "name": "دبلوم هندسة البرمجيات",
  "image": null,
  "generalDesc": "برنامج متكامل لإعداد مهندس برمجيات محترف.",
  "objectivesText": "إتقان دورة حياة تطوير البرمجيات من التصميم إلى النشر.",
  "article": "",
  "duration": "عام واحد",
  "examMode": "عن بُعد",
  "studyMode": "التعلم المدمج",
  "hours": 200,
  "terms": 2,
  "subjects": 2,
  "specialty": "هندسة البرمجيات",
  "fees": {
   "price": "15,000",
   "installments": [
    "tabby",
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "قبل يومين",
  "modules": [
   {
    "name": "قواعد البيانات المتقدمة",
    "specialization": "هندسة البرمجيات",
    "courseLibId": 3
   },
   {
    "name": "الاستجابة للحوادث الأمنية",
    "specialization": "هندسة البرمجيات",
    "courseLibId": 5
   }
  ],
  "trainingKit": {
   "mode": "direct",
   "responsibleNames": [
    "د. منال السبيعي"
   ],
   "status": "in_progress",
   "files": [
    {
     "name": "دليل-المدرب-هندسة-البرمجيات.pdf",
     "kind": "pdf",
     "uploadedBy": "د. منال السبيعي",
     "date": "12 Aug 2026"
    },
    {
     "name": "أوراق-عمل-المتدرب.docx",
     "kind": "doc",
     "uploadedBy": "أ. سلطان الحربي",
     "date": "14 Aug 2026"
    },
    {
     "name": "عرض-المحاضرة-الأولى.pptx",
     "kind": "doc",
     "uploadedBy": "د. منال السبيعي",
     "date": "15 Aug 2026"
    },
    {
     "name": "شرح-أنماط-التصميم.mp4",
     "kind": "video",
     "uploadedBy": "د. فيصل القحطاني",
     "date": "18 Aug 2026"
    }
   ]
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 2,
  "pathId": "DIP-102",
  "type": "diploma",
  "name": "دبلوم الأمن السيبراني",
  "image": "cyber-cover.jpg",
  "generalDesc": "دبلوم مهني متخصص في حماية الأنظمة والشبكات والاستجابة للحوادث.",
  "objectivesText": "تأهيل المتدرب للعمل كأخصائي أمن سيبراني في بيئة مؤسسية.",
  "article": "",
  "duration": "6 أشهر",
  "examMode": "عن بُعد",
  "studyMode": "التعلم المدمج",
  "hours": 170,
  "terms": 2,
  "subjects": 2,
  "specialty": "الأمن السيبراني",
  "fees": {
   "price": "18,000",
   "installments": [
    "tabby",
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin",
    "academic"
   ]
  },
  "status": "active",
  "updated": "قبل 3 أيام",
  "modules": [
   {
    "name": "أساسيات الأمن السيبراني",
    "specialization": "الأمن السيبراني",
    "courseLibId": 1
   },
   {
    "name": "الاستجابة للحوادث الأمنية",
    "specialization": "الأمن السيبراني",
    "courseLibId": 5
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي",
    "د. أحمد الحربي"
   ],
   "status": "ready",
   "files": [
    {
     "name": "حقيبة-الأمن-السيبراني.pdf",
     "kind": "pdf",
     "uploadedBy": "أ. هند العتيبي",
     "date": "2 Sep 2026"
    },
    {
     "name": "قائمة-ضوابط-الحماية.xlsx",
     "kind": "doc",
     "uploadedBy": "د. أحمد الحربي",
     "date": "4 Sep 2026"
    },
    {
     "name": "محاكاة-هجوم-تصيّد.mp4",
     "kind": "video",
     "uploadedBy": "د. أحمد الحربي",
     "date": "6 Sep 2026"
    }
   ]
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 3,
  "pathId": "DIP-103",
  "type": "diploma",
  "name": "دبلوم علم البيانات",
  "image": null,
  "generalDesc": "دبلوم يجمع بين تحليل البيانات وهندسة قواعد البيانات والذكاء الاصطناعي.",
  "objectivesText": "إعداد محلل بيانات قادر على بناء نماذج تنبؤية واستخلاص الرؤى.",
  "article": "",
  "duration": "8 أشهر",
  "examMode": "مختلط (حضوري وعن بُعد)",
  "studyMode": "التعلم المدمج",
  "hours": 140,
  "terms": 2,
  "subjects": 2,
  "specialty": "علم البيانات",
  "fees": {
   "price": "14,500",
   "installments": [
    "tabby"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "أمس",
  "modules": [
   {
    "name": "مقدمة في الذكاء الاصطناعي",
    "specialization": "علم البيانات",
    "courseLibId": 2
   },
   {
    "name": "قواعد البيانات المتقدمة",
    "specialization": "علم البيانات",
    "courseLibId": 3
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. سلطان الحربي"
   ],
   "status": "in_progress",
   "files": []
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 4,
  "pathId": "DIP-104",
  "type": "diploma",
  "name": "دبلوم الشبكات والبنية التحتية",
  "image": null,
  "generalDesc": "دبلوم عملي في تصميم الشبكات المؤسسية وتأمينها.",
  "objectivesText": "تصميم وتشغيل شبكة مؤسسية آمنة وقابلة للتوسع.",
  "article": "",
  "duration": "5 أشهر",
  "examMode": "حضوري",
  "studyMode": "حضوري",
  "hours": 190,
  "terms": 2,
  "subjects": 2,
  "specialty": "الشبكات",
  "fees": {
   "price": "11,000",
   "installments": [
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "قبل أسبوع",
  "modules": [
   {
    "name": "الشبكات الآمنة",
    "specialization": "الشبكات",
    "courseLibId": 4
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "د. فيصل القحطاني"
   ],
   "status": "in_progress",
   "files": []
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 5,
  "pathId": "DIP-105",
  "type": "diploma",
  "name": "دبلوم الذكاء الاصطناعي التطبيقي",
  "image": null,
  "generalDesc": "دبلوم موجّه لتطبيقات الذكاء الاصطناعي في بيئة الأعمال.",
  "objectivesText": "بناء حلول ذكاء اصطناعي عملية وربطها بأنظمة المؤسسة.",
  "article": "",
  "duration": "4 أشهر",
  "examMode": "عن بُعد",
  "studyMode": "عن بُعد (مباشر)",
  "hours": 100,
  "terms": 1,
  "subjects": 1,
  "specialty": "الذكاء الاصطناعي",
  "fees": {
   "price": "9,500",
   "installments": []
  },
  "settings": {
   "webVisible": false,
   "editRoles": [
    "admin"
   ]
  },
  "status": "draft",
  "updated": "قبل 4 أيام",
  "modules": [
   {
    "name": "مقدمة في الذكاء الاصطناعي",
    "specialization": "الذكاء الاصطناعي",
    "courseLibId": 2
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [],
   "status": "not_started",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 },
 {
  "id": 6,
  "pathId": "DIP-106",
  "type": "diploma",
  "name": "دبلوم أمن المعلومات المتقدم",
  "image": null,
  "generalDesc": "نسخة سابقة من الدبلوم المتقدم — مؤرشفة بعد تحديث الخطة.",
  "objectivesText": "تغطية متقدمة لضوابط أمن المعلومات.",
  "article": "",
  "duration": "6 أشهر",
  "examMode": "عن بُعد",
  "studyMode": "التعلم المدمج",
  "hours": 160,
  "terms": 2,
  "subjects": 1,
  "specialty": "الأمن السيبراني",
  "fees": {
   "price": "16,000",
   "installments": [
    "tabby"
   ]
  },
  "settings": {
   "webVisible": false,
   "editRoles": [
    "admin"
   ]
  },
  "status": "archived",
  "updated": "قبل شهر",
  "modules": [
   {
    "name": "الاستجابة للحوادث الأمنية",
    "specialization": "الأمن السيبراني",
    "courseLibId": 5
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي"
   ],
   "status": "ready",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 },
 {
  "id": 11,
  "pathId": "FEL-101",
  "type": "fellowship",
  "name": "زمالة أمن المعلومات المهنية",
  "image": "cyber-cover.jpg",
  "generalDesc": "زمالة مهنية متقدمة تؤهل الممارس لقيادة منظومة أمن المعلومات في المؤسسات الكبرى.",
  "objectivesText": "بناء ممارس معتمد قادر على تصميم ضوابط الحماية وقيادة فرق الاستجابة للحوادث.",
  "article": "",
  "duration": "12 شهراً",
  "examMode": "مختلط (حضوري وعن بُعد)",
  "studyMode": "التعلم المدمج",
  "hours": 170,
  "terms": 3,
  "subjects": 2,
  "specialty": "الأمن السيبراني",
  "fees": {
   "price": "24,000",
   "installments": [
    "tabby",
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin",
    "academic"
   ]
  },
  "status": "active",
  "updated": "قبل يومين",
  "modules": [
   {
    "name": "أساسيات الأمن السيبراني",
    "specialization": "الأمن السيبراني",
    "courseLibId": 1
   },
   {
    "name": "الاستجابة للحوادث الأمنية",
    "specialization": "الأمن السيبراني",
    "courseLibId": 5
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي",
    "د. أحمد الحربي"
   ],
   "status": "ready",
   "files": [
    {
     "name": "إطار-حوكمة-أمن-المعلومات.pdf",
     "kind": "pdf",
     "uploadedBy": "أ. هند العتيبي",
     "date": "20 Sep 2026"
    },
    {
     "name": "نموذج-خطة-الاستجابة.docx",
     "kind": "doc",
     "uploadedBy": "د. أحمد الحربي",
     "date": "22 Sep 2026"
    },
    {
     "name": "ورشة-قيادة-فريق-الاستجابة.mp4",
     "kind": "video",
     "uploadedBy": "د. أحمد الحربي",
     "date": "25 Sep 2026"
    }
   ]
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 12,
  "pathId": "FEL-102",
  "type": "fellowship",
  "name": "زمالة هندسة البيانات",
  "image": null,
  "generalDesc": "زمالة مهنية تركّز على بناء منصات البيانات وتشغيلها على نطاق مؤسسي.",
  "objectivesText": "تأهيل مهندس بيانات قادر على تصميم خطوط المعالجة ونماذج التنبؤ وإدارة المستودعات.",
  "article": "",
  "duration": "10 أشهر",
  "examMode": "عن بُعد",
  "studyMode": "التعلم المدمج",
  "hours": 100,
  "terms": 2,
  "subjects": 2,
  "specialty": "علم البيانات",
  "fees": {
   "price": "19,500",
   "installments": [
    "tabby"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "قبل 4 أيام",
  "modules": [
   {
    "name": "مقدمة في الذكاء الاصطناعي",
    "specialization": "علم البيانات",
    "courseLibId": 2
   },
   {
    "name": "قواعد البيانات المتقدمة",
    "specialization": "علم البيانات",
    "courseLibId": 3
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. سلطان الحربي"
   ],
   "status": "in_progress",
   "files": []
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 13,
  "pathId": "FEL-103",
  "type": "fellowship",
  "name": "زمالة هندسة البرمجيات المتقدمة",
  "image": null,
  "generalDesc": "زمالة مهنية لممارسي هندسة البرمجيات الراغبين في التخصص المعماري.",
  "objectivesText": "إتقان تصميم الأنظمة القابلة للتوسع وقيادة المراجعات الهندسية.",
  "article": "",
  "duration": "9 أشهر",
  "examMode": "مختلط (حضوري وعن بُعد)",
  "studyMode": "التعلم المدمج",
  "hours": 110,
  "terms": 2,
  "subjects": 2,
  "specialty": "هندسة البرمجيات",
  "fees": {
   "price": "21,000",
   "installments": [
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "الأسبوع الماضي",
  "modules": [
   {
    "name": "قواعد البيانات المتقدمة",
    "specialization": "هندسة البرمجيات",
    "courseLibId": 3
   },
   {
    "name": "الاستجابة للحوادث الأمنية",
    "specialization": "هندسة البرمجيات",
    "courseLibId": 5
   }
  ],
  "trainingKit": {
   "mode": "direct",
   "responsibleNames": [],
   "status": "ready",
   "files": [
    {
     "name": "حقيبة-زمالة-هندسة-البرمجيات.pdf",
     "kind": "pdf",
     "uploadedBy": "د. منال السبيعي",
     "date": "1 Sep 2026"
    },
    {
     "name": "مراجعة-معمارية-نموذجية.mp4",
     "kind": "video",
     "uploadedBy": "د. منال السبيعي",
     "date": "3 Sep 2026"
    }
   ]
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 14,
  "pathId": "FEL-104",
  "type": "fellowship",
  "name": "زمالة البنية التحتية والشبكات",
  "image": null,
  "generalDesc": "زمالة مهنية لتأهيل مهندسي الشبكات لقيادة البنية التحتية المؤسسية.",
  "objectivesText": "تصميم وتشغيل بنية شبكية آمنة وعالية التوافر.",
  "article": "",
  "duration": "8 أشهر",
  "examMode": "حضوري",
  "studyMode": "حضوري",
  "hours": 70,
  "terms": 2,
  "subjects": 1,
  "specialty": "الشبكات",
  "fees": {
   "price": "17,500",
   "installments": [
    "tabby"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "قبل أسبوعين",
  "modules": [
   {
    "name": "الشبكات الآمنة",
    "specialization": "الشبكات",
    "courseLibId": 4
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "د. فيصل القحطاني"
   ],
   "status": "in_progress",
   "files": []
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 15,
  "pathId": "FEL-105",
  "type": "fellowship",
  "name": "زمالة الذكاء الاصطناعي التطبيقي",
  "image": null,
  "generalDesc": "زمالة مهنية لتطبيق الذكاء الاصطناعي في القطاعات التشغيلية.",
  "objectivesText": "بناء وتشغيل حلول ذكاء اصطناعي داخل بيئة عمل حقيقية.",
  "article": "",
  "duration": "6 أشهر",
  "examMode": "عن بُعد",
  "studyMode": "عن بُعد (مباشر)",
  "hours": 40,
  "terms": 1,
  "subjects": 1,
  "specialty": "الذكاء الاصطناعي",
  "fees": {
   "price": "13,000",
   "installments": []
  },
  "settings": {
   "webVisible": false,
   "editRoles": [
    "admin"
   ]
  },
  "status": "draft",
  "updated": "قبل 3 أيام",
  "modules": [
   {
    "name": "مقدمة في الذكاء الاصطناعي",
    "specialization": "الذكاء الاصطناعي",
    "courseLibId": 2
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [],
   "status": "not_started",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 },
 {
  "id": 16,
  "pathId": "FEL-106",
  "type": "fellowship",
  "name": "زمالة القيادة التقنية التنفيذية",
  "image": null,
  "generalDesc": "نسخة سابقة من الزمالة التنفيذية — مؤرشفة بعد تحديث الخطة.",
  "objectivesText": "إعداد قيادات تقنية على مستوى الإدارة التنفيذية.",
  "article": "",
  "duration": "12 شهراً",
  "examMode": "مختلط (حضوري وعن بُعد)",
  "studyMode": "التعلم المدمج",
  "hours": 120,
  "terms": 3,
  "subjects": 1,
  "specialty": "الأمن السيبراني",
  "fees": {
   "price": "28,000",
   "installments": [
    "tabby",
    "tamara"
   ]
  },
  "settings": {
   "webVisible": false,
   "editRoles": [
    "admin"
   ]
  },
  "status": "archived",
  "updated": "قبل شهرين",
  "modules": [
   {
    "name": "أساسيات الأمن السيبراني",
    "specialization": "الأمن السيبراني",
    "courseLibId": 1
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي"
   ],
   "status": "ready",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 },
 {
  "id": 21,
  "pathId": "CERT-101",
  "type": "cert",
  "name": "شهادة ممارس الأمن السيبراني المعتمد",
  "image": "cyber-cover.jpg",
  "generalDesc": "شهادة احترافية قصيرة تثبت إتقان الضوابط الأساسية لحماية الأنظمة.",
  "objectivesText": "اجتياز اختبار الممارس المعتمد في الأمن السيبراني.",
  "article": "",
  "audience": "مختصو تقنية المعلومات والراغبون في التحول إلى مجال الأمن السيبراني.",
  "features": "اختبار معتمد · شهادة رقمية قابلة للتحقق · محتوى محدّث سنوياً.",
  "topics": "الضوابط الأساسية · إدارة الهوية · حماية الشبكات.",
  "outcomes": "القدرة على تطبيق ضوابط الحماية الأساسية داخل المؤسسة.",
  "duration": "30 يوماً",
  "examMode": "عن بُعد",
  "studyMode": "عن بُعد (مباشر)",
  "hours": 120,
  "days": 30,
  "terms": 1,
  "subjects": 1,
  "specialty": "الأمن السيبراني",
  "linkedCourseLibId": 1,
  "certSplit": false,
  "fees": {
   "price": "4,800",
   "installments": [
    "tabby"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin",
    "academic"
   ]
  },
  "status": "active",
  "updated": "أمس",
  "modules": [
   {
    "name": "أساسيات الأمن السيبراني",
    "specialization": "",
    "courseLibId": 1
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي"
   ],
   "status": "ready",
   "files": [
    {
     "name": "مرجع-ممارس-الأمن-السيبراني.pdf",
     "kind": "pdf",
     "uploadedBy": "أ. هند العتيبي",
     "date": "28 Sep 2026"
    },
    {
     "name": "بنك-أسئلة-الاختبار.docx",
     "kind": "doc",
     "uploadedBy": "د. أحمد الحربي",
     "date": "30 Sep 2026"
    },
    {
     "name": "شرح-إدارة-الهوية.mp4",
     "kind": "video",
     "uploadedBy": "أ. هند العتيبي",
     "date": "1 Oct 2026"
    }
   ]
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 22,
  "pathId": "CERT-102",
  "type": "cert",
  "name": "شهادة أساسيات الذكاء الاصطناعي",
  "image": null,
  "generalDesc": "شهادة احترافية تمهيدية في مفاهيم الذكاء الاصطناعي وتطبيقاته العملية.",
  "objectivesText": "فهم أساسيات تعلم الآلة وتوظيفها في سياق العمل.",
  "article": "",
  "audience": "المهنيون في مختلف القطاعات الراغبون في فهم الذكاء الاصطناعي.",
  "features": "مدة قصيرة · محتوى عملي · بلا متطلبات سابقة.",
  "topics": "تعلم الآلة · النماذج التوليدية · أخلاقيات الذكاء الاصطناعي.",
  "outcomes": "تحديد فرص توظيف الذكاء الاصطناعي داخل بيئة العمل.",
  "duration": "14 يوماً",
  "examMode": "عن بُعد",
  "studyMode": "عن بُعد (مباشر)",
  "hours": 40,
  "days": 14,
  "terms": 1,
  "subjects": 1,
  "specialty": "الذكاء الاصطناعي",
  "linkedCourseLibId": 2,
  "certSplit": false,
  "fees": {
   "price": "2,900",
   "installments": [
    "tabby",
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "قبل 3 أيام",
  "modules": [
   {
    "name": "مقدمة في الذكاء الاصطناعي",
    "specialization": "",
    "courseLibId": 2
   }
  ],
  "trainingKit": {
   "mode": "direct",
   "responsibleNames": [],
   "status": "ready",
   "files": [
    {
     "name": "حقيبة-شهادة-الذكاء-الاصطناعي.pdf",
     "kind": "pdf",
     "uploadedBy": "د. أحمد الحربي",
     "date": "8 Sep 2026"
    },
    {
     "name": "دفتر-تمارين-تعلم-الآلة.docx",
     "kind": "doc",
     "uploadedBy": "د. أحمد الحربي",
     "date": "9 Sep 2026"
    }
   ]
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 23,
  "pathId": "CERT-103",
  "type": "cert",
  "name": "شهادة مسؤول قواعد البيانات المعتمد",
  "image": null,
  "generalDesc": "شهادة احترافية في تصميم قواعد البيانات وضبط أدائها.",
  "objectivesText": "إتقان الاستعلامات المتقدمة وضبط أداء قواعد البيانات.",
  "article": "",
  "audience": "مطورو التطبيقات ومسؤولو قواعد البيانات.",
  "features": "تدريب حضوري · تمارين على بيانات حقيقية.",
  "topics": "النمذجة · الفهرسة · ضبط الأداء.",
  "outcomes": "تصميم قاعدة بيانات مؤسسية وضبط أدائها.",
  "duration": "20 يوماً",
  "examMode": "حضوري",
  "studyMode": "حضوري",
  "hours": 60,
  "days": 20,
  "terms": 1,
  "subjects": 1,
  "specialty": "هندسة البرمجيات",
  "linkedCourseLibId": 3,
  "certSplit": true,
  "fees": {
   "price": "5,400",
   "installments": [
    "tamara"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "الأسبوع الماضي",
  "modules": [
   {
    "name": "قواعد البيانات المتقدمة",
    "specialization": "",
    "courseLibId": 3
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "د. فيصل القحطاني",
    "أ. سلطان الحربي"
   ],
   "status": "in_progress",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 },
 {
  "id": 24,
  "pathId": "CERT-104",
  "type": "cert",
  "name": "شهادة أمن الشبكات المعتمد",
  "image": null,
  "generalDesc": "شهادة احترافية في تأمين الشبكات المؤسسية وتجزئتها.",
  "objectivesText": "تصميم شبكة مؤسسية آمنة وفق أفضل الممارسات.",
  "article": "",
  "audience": "مهندسو الشبكات ومسؤولو البنية التحتية.",
  "features": "معمل عملي · سيناريوهات هجوم واقعية.",
  "topics": "التجزئة · جدران الحماية · المراقبة.",
  "outcomes": "تطبيق ضوابط أمن الشبكات في بيئة إنتاج.",
  "duration": "18 يوماً",
  "examMode": "حضوري",
  "studyMode": "التعلم المدمج",
  "hours": 70,
  "days": 18,
  "terms": 1,
  "subjects": 1,
  "specialty": "الشبكات",
  "linkedCourseLibId": 4,
  "certSplit": false,
  "fees": {
   "price": "6,200",
   "installments": []
  },
  "settings": {
   "webVisible": false,
   "editRoles": [
    "admin"
   ]
  },
  "status": "draft",
  "updated": "قبل يومين",
  "modules": [
   {
    "name": "الشبكات الآمنة",
    "specialization": "",
    "courseLibId": 4
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [],
   "status": "not_started",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 },
 {
  "id": 25,
  "pathId": "CERT-105",
  "type": "cert",
  "name": "شهادة الاستجابة للحوادث الأمنية",
  "image": null,
  "generalDesc": "شهادة احترافية في بناء خطط الاستجابة للحوادث وتنفيذها.",
  "objectivesText": "قيادة الاستجابة لحادث أمني من الاكتشاف حتى التعافي.",
  "article": "",
  "audience": "فرق مراكز العمليات الأمنية ومسؤولو المخاطر.",
  "features": "تمارين محاكاة · قوالب جاهزة لخطط الاستجابة.",
  "topics": "الاكتشاف · الاحتواء · التعافي · التوثيق.",
  "outcomes": "إعداد خطة استجابة للحوادث قابلة للتطبيق.",
  "duration": "15 يوماً",
  "examMode": "عن بُعد",
  "studyMode": "عن بُعد (مباشر)",
  "hours": 50,
  "days": 15,
  "terms": 1,
  "subjects": 1,
  "specialty": "الأمن السيبراني",
  "linkedCourseLibId": 5,
  "certSplit": false,
  "fees": {
   "price": "5,900",
   "installments": [
    "tabby"
   ]
  },
  "settings": {
   "webVisible": true,
   "editRoles": [
    "admin"
   ]
  },
  "status": "active",
  "updated": "قبل أسبوع",
  "modules": [
   {
    "name": "الاستجابة للحوادث الأمنية",
    "specialization": "",
    "courseLibId": 5
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي"
   ],
   "status": "ready",
   "files": []
  },
  "groupsCount": 1,
  "learnersCount": 0
 },
 {
  "id": 26,
  "pathId": "CERT-106",
  "type": "cert",
  "name": "شهادة أمن المعلومات التمهيدية",
  "image": null,
  "generalDesc": "نسخة سابقة من الشهادة التمهيدية — مؤرشفة بعد تحديث المحتوى.",
  "objectivesText": "تغطية تمهيدية لمفاهيم أمن المعلومات.",
  "article": "",
  "audience": "المبتدئون في مجال أمن المعلومات.",
  "features": "محتوى تمهيدي مختصر.",
  "topics": "مفاهيم أساسية.",
  "outcomes": "فهم المصطلحات الأساسية.",
  "duration": "30 يوماً",
  "examMode": "عن بُعد",
  "studyMode": "عن بُعد (مباشر)",
  "hours": 120,
  "days": 30,
  "terms": 1,
  "subjects": 1,
  "specialty": "الأمن السيبراني",
  "linkedCourseLibId": 1,
  "certSplit": true,
  "fees": {
   "price": "1,800",
   "installments": []
  },
  "settings": {
   "webVisible": false,
   "editRoles": [
    "admin"
   ]
  },
  "status": "archived",
  "updated": "قبل شهرين",
  "modules": [
   {
    "name": "أساسيات الأمن السيبراني",
    "specialization": "",
    "courseLibId": 1
   }
  ],
  "trainingKit": {
   "mode": "assign",
   "responsibleNames": [
    "أ. هند العتيبي"
   ],
   "status": "ready",
   "files": []
  },
  "groupsCount": 0,
  "learnersCount": 0
 }
];
MOCK.POOL = [
 {
  "name": "د. أحمد الحربي",
  "specialty": "الأمن السيبراني والذكاء الاصطناعي",
  "avatar": "أح"
 },
 {
  "name": "د. فيصل القحطاني",
  "specialty": "قواعد البيانات والشبكات",
  "avatar": "فق"
 },
 {
  "name": "د. منال السبيعي",
  "specialty": "إدارة المشاريع والقيادة",
  "avatar": "من"
 },
 {
  "name": "د. هند العتيبي",
  "specialty": "التسويق الرقمي",
  "avatar": "هع"
 },
 {
  "name": "أ. هند العتيبي",
  "specialty": "إشراف أكاديمي — الأمن السيبراني",
  "avatar": "هع"
 },
 {
  "name": "أ. سلطان الحربي",
  "specialty": "إشراف أكاديمي — تقنية المعلومات",
  "avatar": "سح"
 }
];
