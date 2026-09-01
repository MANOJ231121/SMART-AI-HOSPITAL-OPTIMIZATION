const WORD_TO_DIGIT = {
  // English words
  "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
  "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
  "ten": "10", "double": "", "triple": "",
  // Hindi transliteration & Devanagari
  "shunya": "0", "ek": "1", "do": "2", "teen": "3", "char": "4",
  "panch": "5", "chhe": "6", "chhah": "6", "saat": "7", "aath": "8", "nau": "9", "das": "10",
  "शून्य": "0", "एक": "1", "दो": "2", "तीन": "3", "चार": "4",
  "पांच": "5", "छह": "6", "सात": "7", "आठ": "8", "नौ": "9", "दस": "10",
  // Gujarati
  "be": "2", "tran": "3", "chha": "6",
  "શૂન્ય": "0", "એક": "1", "બે": "2", "ત્રણ": "3", "ચાર": "4",
  "પાંચ": "5", "છ": "6", "સાત": "7", "આઠ": "8", "નવ": "9", "દસ": "10",
  "૦":"0", "૧":"1", "૨":"2", "૩":"3", "૪":"4", "૫":"5", "૬":"6", "૭":"7", "૮":"8", "૯":"9"
};

export function smartExtractName(answer) {
  if (!answer) return "Patient";
  let clean = answer
    .replace(/^(hello|hi|namaste|kem cho|pranam)\b/i, "")
    .replace(/\b(my name is|i am|this is|myself|mera naam|maru naam|naam hai|chhe|hai|bol raha hu|bol rahi hu)\b/gi, "")
    .replace(/[^\w\s\u0900-\u097F\u0A80-\u0AFF]/gi, "")
    .trim();

  if (!clean || clean.length < 2) return answer.trim() || "Patient";

  // Capitalize title-case
  return clean
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function smartExtractAge(answer) {
  if (!answer) return "30";
  let text = answer.toLowerCase();

  // Replace Gujarati digits if any
  const gujaratiDigits = { '૦':'0', '૧':'1', '૨':'2', '૩':'3', '૪':'4', '૫':'5', '૬':'6', '૭':'7', '૮':'8', '૯':'9' };
  text = text.replace(/[૦-૯]/g, (d) => gujaratiDigits[d] || d);

  // Match digit sequences
  const match = text.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num > 0 && num < 125) return String(num);
  }

  // Spoken age expressions
  if (/twenty\s*one|ikkis|ekvis|इक्कीस|એકવીસ/i.test(text)) return "21";
  if (/twenty\s*two|baais|bavis|बाईस|બાવીસ/i.test(text)) return "22";
  if (/twenty\s*five|pachees|pachis|પચીસ/i.test(text)) return "25";
  if (/twenty|bees|vis|बीस|વીસ/i.test(text)) return "20";
  if (/thirty|tees|tris|तीस|ત્રીસ/i.test(text)) return "30";
  if (/forty|chaalis|chalis|ચાળીસ/i.test(text)) return "40";
  if (/fifty|pachaas|pachas|પચાસ/i.test(text)) return "50";
  if (/sixty|saath|santh|સાઠ/i.test(text)) return "60";

  return "28";
}

export function smartExtractGender(answer) {
  if (!answer) return "Male";
  const clean = answer.toLowerCase().trim();

  // Female variations (including common speech recognition phonetic misheard 'email' / 'fe male')
  if (
    /female|fe\s*male|e\s*mail|woman|lady|girl|mahila|aurat|ladki|ben|bahen|stree|stri|સ્ત્રી|મહિલા|औरत|महिला|लड़की|बहन/i.test(clean)
  ) {
    return "Female";
  }

  // Male variations (including speech recognition transcription 'mail', 'mel', 'mayil')
  if (
    /^mail$|^mel$|male|man|boy|gent|gentleman|purush|mard|ladka|bhai|bhaiya|bapu|પુરુષ|ભાઈ|पुरुष|मर्द|लड़का|भाई/i.test(clean)
  ) {
    return "Male";
  }

  // Other / non-binary
  if (/other|trans|transgender|अन्य|બીજું/i.test(clean)) {
    return "Other";
  }

  return "Male";
}

export function smartExtractContact(answer) {
  if (!answer) return "9876543210";
  let text = answer.toLowerCase();

  // Replace spoken word numbers with digits
  Object.keys(WORD_TO_DIGIT).forEach((word) => {
    text = text.replace(new RegExp(`\\b${word}\\b`, 'gi'), WORD_TO_DIGIT[word]);
  });

  // Extract all digit characters
  let digits = text.replace(/\D/g, "");

  if (digits.length >= 10) {
    return digits.slice(-10);
  }

  // If 7-9 digits were captured, format or provide clean phone string
  if (digits.length > 5) {
    return digits;
  }

  return "9876543210";
}

export function getRegistrationScript(lang = "hi") {
  if (lang === "en") {
    return [
      {
        key: "name",
        q: "Hello and welcome to SmartCare Hospital. To begin your registration, please tell me your full name.",
        extractLabel: "Name",
        extract: smartExtractName,
      },
      {
        key: "age",
        q: "Thank you. What is your age?",
        extractLabel: "Age",
        extract: smartExtractAge,
      },
      {
        key: "gender",
        q: "Could you please tell me your gender (Male, Female, or Other)?",
        extractLabel: "Gender",
        extract: smartExtractGender,
      },
      {
        key: "contact",
        q: "What is your 10-digit mobile number so we can send your token information?",
        extractLabel: "Contact",
        extract: smartExtractContact,
      },
      {
        key: "complaint",
        q: "Now, please describe what symptoms or health problems you are facing today.",
        extractLabel: "Main Symptom",
        extract: (answer) => answer.trim(),
      },
    ];
  }

  if (lang === "gu") {
    return [
      {
        key: "name",
        q: "નમસ્તે! સ્માર્ટકેર હોસ્પિટલમાં આપનું સ્વાગત છે. રજીસ્ટ્રેશન માટે સૌથી પહેલાં તમારું નામ જણાવો.",
        extractLabel: "Name",
        extract: smartExtractName,
      },
      {
        key: "age",
        q: "આભાર. તમારી ઉંમર કેટલી છે?",
        extractLabel: "Age",
        extract: smartExtractAge,
      },
      {
        key: "gender",
        q: "તમે તમારું જેન્ડર (પુરુષ કે સ્ત્રી) જણાવી શકો છો?",
        extractLabel: "Gender",
        extract: smartExtractGender,
      },
      {
        key: "contact",
        q: "તમારો મોબાઈલ નંબર શું છે, જેથી અમે તમને ટોકનની વિગતો મોકલી શકીએ?",
        extractLabel: "Contact",
        extract: smartExtractContact,
      },
      {
        key: "complaint",
        q: "હવે જણાવો, તમને શું તકલીફ કે સમસ્યા થઈ રહી છે?",
        extractLabel: "Main Symptom",
        extract: (answer) => answer.trim(),
      },
    ];
  }

  // Default: Hindi ("hi")
  return [
    {
      key: "name",
      q: "नमस्ते! SmartCare Hospital में आपका स्वागत है। रजिस्ट्रेशन के लिए सबसे पहले अपना नाम बताइए।",
      extractLabel: "Name",
      extract: smartExtractName,
    },
    {
      key: "age",
      q: "धन्यवाद। आपकी उम्र क्या है?",
      extractLabel: "Age",
      extract: smartExtractAge,
    },
    {
      key: "gender",
      q: "आप अपना लिंग (Gender — पुरुष या महिला) बता सकते हैं?",
      extractLabel: "Gender",
      extract: smartExtractGender,
    },
    {
      key: "contact",
      q: "आपका 10 अंकों का मोबाइल नंबर क्या है, ताकि हम टोकन की जानकारी भेज सकें?",
      extractLabel: "Contact",
      extract: smartExtractContact,
    },
    {
      key: "complaint",
      q: "अब बताइए, आपको क्या समस्या या तकलीफ़ हो रही है?",
      extractLabel: "Main Symptom",
      extract: (answer) => answer.trim(),
    },
  ];
}

const REGISTRATION_SCRIPT = getRegistrationScript("hi");
export default REGISTRATION_SCRIPT;