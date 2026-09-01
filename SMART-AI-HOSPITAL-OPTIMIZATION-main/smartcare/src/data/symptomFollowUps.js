const DURATION_REGEX = /(\d+|[૦-૯]+)\s*(din|दिन|days?|hafte|हफ्ते|weeks?|mahine|महीने|months?|divas|દિવસ|divaso|દિવસે|athvadiya|અઠવાડિયા|mahina|મહિના|hours?|ghante|घंटे|કલાક)/i;

const GUJARATI_DIGITS = { '૦':'0', '૧':'1', '૨':'2', '૩':'3', '૪':'4', '૫':'5', '૬':'6', '૭':'7', '૮':'8', '૯':'9' };

export function extractDuration(text) {
  if (!text) return null;
  const match = text.match(DURATION_REGEX);
  if (!match) return null;
  let num = match[1].replace(/[૦-૯]/g, (d) => GUJARATI_DIGITS[d] || d);
  return `${num} ${match[2]}`;
}

export function extractSeverity(text) {
  if (!text) return null;
  if (/severe|zyada|bahut zyada|tez|गंभीर|ज्यादा|बहुत ज्यादा|तेज़|વધારે|તીવ્ર|ખૂબ વધારે|અસહ્ય|vadhare|khub vadhare|asahiya|extreme|unbearable/i.test(text)) {
    return "Severe";
  }
  if (/moderate|मध्यम|મધ્યમ|normal/i.test(text)) {
    return "Moderate";
  }
  if (/mild|halka|thoda|हल्का|थोड़ा|હળવો|થોડો|સામાન્ય|thodu|samanya|slight/i.test(text)) {
    return "Mild";
  }
  return null;
}

function yesNo(text) {
  return /haan|han|yes|yep|ha|haa|हां|हाँ|હા|હાં/i.test(text) ? "Yes" : "No";
}

const FOLLOW_UP_SETS_MULTILINGUAL = {
  en: {
    fever: [
      {
        key: "fever_duration",
        q: "How many days have you had this fever?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "fever_severity",
        q: "Is the fever mild, moderate, or very high?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
      {
        key: "fever_symptoms",
        q: "Do you have chills, shivering, cough, or body ache along with fever?",
        extractLabel: "Associated Symptoms",
        extract: (a) => a.trim(),
      },
    ],
    joint_pain: [
      {
        key: "swelling",
        q: "Do you also notice swelling or stiffness around the joint?",
        extractLabel: "Swelling",
        extract: yesNo,
      },
      {
        key: "pain_severity",
        q: "How intense is the pain — mild, moderate, or severe?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
    skin: [
      {
        key: "itching",
        q: "Are you experiencing severe itching, redness, or burning sensation?",
        extractLabel: "Itching",
        extract: yesNo,
      },
      {
        key: "skin_duration",
        q: "How many days has this skin problem been present?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
    ],
    cough_cold: [
      {
        key: "cough_type",
        q: "Is your cough dry or with mucus/phlegm?",
        extractLabel: "Cough Type",
        extract: (a) => (/mucus|phlegm|wet|balgam/i.test(a) ? "Wet" : "Dry"),
      },
      {
        key: "cough_duration",
        q: "How many days have you had this cough or cold?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
    ],
    chest: [
      {
        key: "chest_pain_type",
        q: "Is the chest discomfort in the center or spreading towards arms/shoulder?",
        extractLabel: "Pain Location",
        extract: (a) => a.trim(),
      },
      {
        key: "breathlessness",
        q: "Are you having difficulty breathing or shortness of breath?",
        extractLabel: "Breathlessness",
        extract: yesNo,
      },
    ],
    neurology: [
      {
        key: "headache_duration",
        q: "How long have you had this headache or dizziness?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "headache_severity",
        q: "Is the headache constant, throbbing, or accompanied by nausea?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
    general: [
      {
        key: "general_duration",
        q: "How many days have you been experiencing this problem?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "general_severity",
        q: "How severe is your condition — mild, moderate, or severe?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
  },

  gu: {
    fever: [
      {
        key: "fever_duration",
        q: "તાવ કેટલા દિવસથી આવી રહ્યો છે?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "fever_severity",
        q: "તાવ વધુ છે, મધ્યમ છે કે સામાન્ય જણાય છે?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
      {
        key: "fever_symptoms",
        q: "તાવ સાથે ધ્રુજારી, શરદી કે શરીરમાં કળતર-દુખાવો છે?",
        extractLabel: "Associated Symptoms",
        extract: (a) => a.trim(),
      },
    ],
    joint_pain: [
      {
        key: "swelling",
        q: "શું તમને સાંધા કે ઘૂંટણમાં સોજો પણ છે?",
        extractLabel: "Swelling",
        extract: yesNo,
      },
      {
        key: "pain_severity",
        q: "દુખાવો કેટલો વધારે છે — સામાન્ય, મધ્યમ કે વધારે?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
    skin: [
      {
        key: "itching",
        q: "શું તમને ખંજવાળ કે બળતરા પણ થાય છે?",
        extractLabel: "Itching",
        extract: yesNo,
      },
      {
        key: "skin_duration",
        q: "આ ચામડીની તકલીફ કેટલા દિવસથી છે?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
    ],
    cough_cold: [
      {
        key: "cough_type",
        q: "ખાંસી સૂકી છે કે કફ સાથે?",
        extractLabel: "Cough Type",
        extract: (a) => (/કફ|balgam|mucus|wet/i.test(a) ? "Wet" : "Dry"),
      },
      {
        key: "cough_duration",
        q: "આ ખાંસી કે શરદી કેટલા દિવસથી છે?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
    ],
    chest: [
      {
        key: "chest_pain_type",
        q: "છાતીમાં દુખાવો વચ્ચે થાય છે કે બાજુમાં ફેલાય છે?",
        extractLabel: "Pain Location",
        extract: (a) => a.trim(),
      },
      {
        key: "breathlessness",
        q: "શું તમને શ્વાસ લેવામાં પણ તકલીફ થઈ રહી છે?",
        extractLabel: "Breathlessness",
        extract: yesNo,
      },
    ],
    neurology: [
      {
        key: "headache_duration",
        q: "માથાનો દુખાવો કે ચક્કર કેટલા સમયથી છે?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "headache_severity",
        q: "દુખાવો કેટલો તીવ્ર છે — સામાન્ય કે વધારે?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
    general: [
      {
        key: "general_duration",
        q: "આ સમસ્યા કેટલા દિવસથી થઈ રહી છે?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "general_severity",
        q: "તકલીફ કેટલી ગંભીર છે — સામાન્ય, મધ્યમ કે વધારે?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
  },

  hi: {
    fever: [
      {
        key: "fever_duration",
        q: "बुखार कितने दिनों से आ रहा है?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "fever_severity",
        q: "बुखार ज्यादा तेज है, मध्यम है या हल्का लग रहा है?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
      {
        key: "fever_symptoms",
        q: "बुखार के साथ ठंड लगना, खांसी या शरीर में दर्द भी है?",
        extractLabel: "Associated Symptoms",
        extract: (a) => a.trim(),
      },
    ],
    joint_pain: [
      {
        key: "swelling",
        q: "क्या आपको जोड़ों में सूजन (swelling) भी है?",
        extractLabel: "Swelling",
        extract: yesNo,
      },
      {
        key: "pain_severity",
        q: "दर्द कितना तेज है — हल्का, मध्यम, या बहुत ज्यादा?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
    skin: [
      {
        key: "itching",
        q: "क्या खुजली (itching) या जलन भी हो रही है?",
        extractLabel: "Itching",
        extract: yesNo,
      },
      {
        key: "skin_duration",
        q: "यह समस्या कितने दिनों से है?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
    ],
    cough_cold: [
      {
        key: "cough_type",
        q: "खांसी सूखी है या बलगम/कफ के साथ?",
        extractLabel: "Cough Type",
        extract: (a) => (/balgam|mucus|wet|कफ|बलगम/i.test(a) ? "Wet" : "Dry"),
      },
      {
        key: "cough_duration",
        q: "यह खांसी या सर्दी कितने दिनों से है?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
    ],
    chest: [
      {
        key: "chest_pain_type",
        q: "दर्द सीने के बीच में है या कंधे और बाजू की तरफ फैल रहा है?",
        extractLabel: "Pain Location",
        extract: (a) => a.trim(),
      },
      {
        key: "breathlessness",
        q: "क्या सांस लेने में भी कोई तकलीफ हो रही है?",
        extractLabel: "Breathlessness",
        extract: yesNo,
      },
    ],
    neurology: [
      {
        key: "headache_duration",
        q: "सिरदर्द या चक्कर कितने दिनों से आ रहे हैं?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "headache_severity",
        q: "दर्द कितना तेज है — हल्का, मध्यम, या बहुत तेज?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
    general: [
      {
        key: "general_duration",
        q: "यह समस्या कितने दिनों से है?",
        extractLabel: "Duration",
        extract: (a) => extractDuration(a) || a.trim(),
      },
      {
        key: "general_severity",
        q: "समस्या कितनी गंभीर है — हल्की, मध्यम, या ज्यादा तेज?",
        extractLabel: "Severity",
        extract: (a) => extractSeverity(a) || a.trim(),
      },
    ],
  },
};

export function getFollowUpsForComplaint(complaintText, lang = "hi") {
  const text = (complaintText || "").toLowerCase();
  const selectedLang = FOLLOW_UP_SETS_MULTILINGUAL[lang] ? lang : "hi";
  const sets = FOLLOW_UP_SETS_MULTILINGUAL[selectedLang];

  let set;
  if (/bukhar|fever|बुखार|તાવ|tav/i.test(text)) {
    set = [...sets.fever];
  } else if (/knee|joint|ghutna|jodo|kamar|घुटन|जोड़|કમર|ઘૂંટણ|સાંધા|હાડકા|sandha|hadka|back pain|shoulder|ankle/i.test(text)) {
    set = [...sets.joint_pain];
  } else if (/skin|rash|khujli|itch|खुजली|दाने|ચામડી|ખંજવાળ|ધાબળા|ખીલ|chamdi|khanjwal|acne|allergy/i.test(text)) {
    set = [...sets.skin];
  } else if (/khaansi|cough|cold|खांसी|सर्दी|ખાંસી|શરદી|કફ|khasi|shardi/i.test(text)) {
    set = [...sets.cough_cold];
  } else if (/chest|seene|saans|breathless|सीने|સાંસ|છાતી|હૃદય|chhati|shwas|heart/i.test(text)) {
    set = [...sets.chest];
  } else if (/headache|migraine|sar dard|sir dard|dizzy|chakkar|सिरदर्द|चक्कर|માથું|માથાનો દુખાવો/i.test(text)) {
    set = [...sets.neurology];
  } else {
    set = [...sets.general];
  }

  const preDuration = extractDuration(complaintText);
  const preSeverity = extractSeverity(complaintText);

  const filtered = set.filter((s) => {
    if (preDuration && s.extractLabel === "Duration") return false;
    if (preSeverity && s.extractLabel === "Severity") return false;
    return true;
  });

  return { steps: filtered, preDuration, preSeverity };
}

// Returns a rich, concise symptom summary label
export function getComplaintLabel(complaintText) {
  const text = (complaintText || "").toLowerCase();
  const symptoms = [];

  if (/knee|joint|ghutna|jodo|घुटन|जोड़|ઘૂંટણ|સાંધા|હાડકા|sandha|hadka/i.test(text)) {
    symptoms.push("Joint/Knee Pain");
  }
  if (/headache|sar dard|sir dard|सिरदर्द|માથું|માથાનો દુખાવો|migraine/i.test(text)) {
    symptoms.push("Headache");
  }
  if (/bukhar|fever|बुखार|તાવ|tav/i.test(text)) {
    symptoms.push("Fever");
  }
  if (/skin|rash|khujli|खुजली|ચામડી|ખંજવાળ|ધાબળા|chamdi|khanjwal/i.test(text)) {
    symptoms.push("Skin Issue");
  }
  if (/khaansi|cough|cold|खांसी|ખાંસી|શરદી|કફ|khasi|shardi/i.test(text)) {
    symptoms.push("Cough/Cold");
  }
  if (/chest|seene|सीने|છાતી|chhati|heart/i.test(text)) {
    symptoms.push("Chest Pain");
  }

  if (symptoms.length > 0) {
    return symptoms.join(" + ");
  }

  return "General Complaint";
}