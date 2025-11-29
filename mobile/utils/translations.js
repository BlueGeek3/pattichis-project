// Localization Data for English and Greek
export const TRANSLATIONS = {
  en: {
    settings_title: "Settings",
    dark_mode_title: "Dark Mode",
    language_title: "Language",
    change_btn: "Change",
    close_btn: "Close",
    header_title: "MS Symptom Diary",
    header_title2: "Symptom Diary",
    session_expired_title: "Session Expired",
    session_expired_msg: "Please log in again.",
    logged_out_title: "Logged Out",
    logged_out_msg: "You have been successfully signed out.",
    logout_error_title: "Error",
    logout_error_msg: "Failed to complete sign out process.",
    month_prefix: "Month:",
    year_prefix: "Year:",
    no_report_data: "No history entries to report.",
    download_report_btn: "Download Full History PDF Report",
    add_log_btn: "Add Symptom Log (use Log tab)",
    settings_menu: "Settings",
    logout_menu: "Log Out",
    report_user_label: "User:",
    report_generated_label: "Generated:",
    report_entries_label: "Total entries:",
    report_avg_pain_label: "Average pain score:",
    report_avg_hours_label: "Average hours affected:",
    report_table_date: "Date",
    report_table_symptom: "Symptom",
    report_table_pain: "Pain",
    report_table_hours: "Hours",
  },
  gr: {
    settings_title: "Ρυθμίσεις",
    dark_mode_title: "Σκοτεινή Λειτουργία",
    language_title: "Γλώσσα",
    change_btn: "Αλλαγή",
    close_btn: "Κλείσιμο",
    header_title: "Ημερολόγιο Συμπτωμάτων ΣΚΠ",
    header_title2: "Ημερολόγιο Συμπτωμάτων",
    session_expired_title: "Η συνεδρία έληξε",
    session_expired_msg: "Παρακαλώ συνδεθείτε ξανά.",
    logged_out_title: "Αποσύνδεση",
    logged_out_msg: "Έχετε αποσυνδεθεί επιτυχώς.",
    logout_error_title: "Σφάλμα",
    logout_error_msg: "Αποτυχία ολοκλήρωσης της διαδικασίας αποσύνδεσης.",
    month_prefix: "Μήνας:",
    year_prefix: "Έτος:",
    no_report_data: "Δεν υπάρχουν καταχωρήσεις ιστορικού για αναφορά.",
    download_report_btn: "Λήψη Πλήρους Αναφοράς Ιστορικού PDF",
    add_log_btn: "Προσθήκη Καταγραφής (Καρτέλα Καταγραφής)",
    settings_menu: "Ρυθμίσεις",
    logout_menu: "Αποσύνδεση",
    report_user_label: "Χρήστης:",
    report_generated_label: "Δημιουργήθηκε:",
    report_entries_label: "Συνολικές καταχωρήσεις:",
    report_avg_pain_label: "Μέσος όρος πόνου:",
    report_avg_hours_label: "Μέσος όρος ωρών επίδρασης:",
    report_table_date: "Ημερομηνία",
    report_table_symptom: "Σύμπτωμα",
    report_table_pain: "Πόνος",
    report_table_hours: "Ώρες",
  },
};

/**
 * Helper to get the translation object based on the selected language name.
 * @param {string} language - "English" or "Greek"
 */
export const getTranslations = (language) => {
  const langKey = language === "Greek" ? "gr" : "en";
  return TRANSLATIONS[langKey] || TRANSLATIONS.en;
};

/**
 * Helper to get the month names based on the selected language name.
 * @param {string} language - "English" or "Greek"
 */
export const getMonthNames = (language) => {
  if (language === "Greek") {
    return [
      "Ιανουάριος",
      "Φεβρουάριος",
      "Μάρτιος",
      "Απρίλιος",
      "Μάιος",
      "Ιούνιος",
      "Ιούλιος",
      "Αύγουστος",
      "Σεπτέμβριος",
      "Οκτώβριος",
      "Νοέμβριος",
      "Δεκέμβριος",
    ];
  }
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
};
