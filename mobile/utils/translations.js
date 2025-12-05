// Localization Data for English and Greek for Home screen
export const HOME_TRANSLATIONS = {
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
export const getHomeTranslations = (language) => {
  const langKey = language === "Greek" ? "gr" : "en";
  return HOME_TRANSLATIONS[langKey] || HOME_TRANSLATIONS.en;
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

// Localization Data for the History Screen
export const HISTORY_TRANSLATIONS = {
  en: {
    screen_title: "History",
    loading: "Loading…",
    retry: "Retry",
    no_logs: "No logs yet.",
    symptom_default: "Symptom",
    pain_label: "Pain",
    hours_label: "Hours",
    date_label: "Date",
    pain_score_label: "Pain score",
    close_dialog: "Close",
    session_expired_title: "Session Expired",
    session_expired_msg: "Please log in again.",
  },
  gr: {
    screen_title: "Ιστορικό",
    loading: "Φόρτωση…",
    retry: "Επανάληψη",
    no_logs: "Δεν υπάρχουν καταγραφές.",
    symptom_default: "Σύμπτωμα",
    pain_label: "Πόνος",
    hours_label: "Ώρες",
    date_label: "Ημερομηνία",
    pain_score_label: "Βαθμός πόνου",
    close_dialog: "Κλείσιμο",
    session_expired_title: "Η συνεδρία έληξε",
    session_expired_msg: "Παρακαλώ συνδεθείτε ξανά.",
  },
};

/**
 * Helper to get the history screen translation object based on the selected language name.
 * @param {string} language - "English" or "Greek"
 */
export const getHistoryTranslations = (language) => {
  const langKey = language === "Greek" ? "gr" : "en";
  return HISTORY_TRANSLATIONS[langKey] || HISTORY_TRANSLATIONS.en;
};

// Localization Data for the Log Screen
export const LOG_TRANSLATIONS = {
  en: {
    title: "New Symptom Log",
    date_label: "Date (YYYY-MM-DD)",
    select_symptom_placeholder: "Select a symptom",
    pain_label: "Pain (0–10)",
    hours_label: "Hours",
    daily_rating_label: "Daily Rating (optional 0–10)",
    systolic_label: "Systolic Pressure",
    diastolic_label: "Diastolic Pressure",
    save_button: "Save Log",
    error_choose_symptom: "Please choose a symptom",
    error_pain_range: "Pain must be 0–10",
    error_rating_range: "Daily rating must be 0–10",
    success_saved: "Saved!",
    error_saving: "Error saving log",
    session_expired_title: "Session Expired",
    session_expired_msg: "Please log in again.",
  },
  gr: {
    title: "Νέα Καταγραφή Συμπτωμάτων",
    date_label: "Ημερομηνία (ΕΕΕΕ-ΜΜ-ΗΗ)",
    select_symptom_placeholder: "Επιλέξτε ένα σύμπτωμα",
    pain_label: "Πόνος (0–10)",
    hours_label: "Ώρες",
    daily_rating_label: "Καθημερινή Αξιολόγηση (προαιρετικό 0–10)",
    systolic_label: "Συστολική Πίεση",
    diastolic_label: "Διαστολική Πίεση",
    save_button: "Αποθήκευση Καταγραφής",
    error_choose_symptom: "Παρακαλώ επιλέξτε ένα σύμπτωμα",
    error_pain_range: "Ο πόνος πρέπει να είναι 0–10",
    error_rating_range: "Η καθημερινή αξιολόγηση πρέπει να είναι 0–10",
    success_saved: "Αποθηκεύτηκε!",
    error_saving: "Σφάλμα κατά την αποθήκευση της καταγραφής",
    session_expired_title: "Η συνεδρία έληξε",
    session_expired_msg: "Παρακαλώ συνδεθείτε ξανά.",
  },
};

/**
 * Helper to get the log screen translation object based on the selected language name.
 * @param {string} language - "English" or "Greek"
 */
export const getLogTranslations = (language) => {
  const langKey = language === "Greek" ? "gr" : "en";
  return LOG_TRANSLATIONS[langKey] || LOG_TRANSLATIONS.en;
};

// Localization Data for the Profile Screen
export const PROFILE_TRANSLATIONS = {
  en: {
    screen_title: "Profile",
    loading: "Loading...",
    username_label: "Username",
    email_label: "Email",
    mobile_label: "Mobile Number",
    dob_label: "Date of Birth (YYYY-MM-DD)",
    doctor_email_label: "Doctor's Email",

    // Validation helpers
    valid_email_helper: "Enter a valid email",
    valid_mobile_helper: "Phone between 7-15 digits",
    valid_dob_helper: "Format must be YYYY-MM-DD",

    // Buttons/Saving
    save_button: "Save",
    saving: "Saving...",

    // Alerts
    alert_validation_title: "Validation",
    alert_validation_msg: "Please fill all required fields correctly.",
    alert_error_title: "Error",
    alert_fetch_error: "Failed to fetch user data",
    alert_update_failed: "Update failed", // API message
    alert_update_error: "Failed to update user", // Catch message
    alert_success_title: "Success",
    alert_update_success: "User updated successfully",

    // Session
    session_expired_title: "Session Expired",
    session_expired_msg: "Please log in again.",
  },
  gr: {
    screen_title: "Προφίλ",
    loading: "Φόρτωση...",
    username_label: "Όνομα χρήστη",
    email_label: "Ηλεκτρονικό Ταχυδρομείο",
    mobile_label: "Αριθμός Κινητού",
    dob_label: "Ημερομηνία Γέννησης (ΕΕΕΕ-ΜΜ-ΗΗ)",
    doctor_email_label: "Ηλεκτρονικό Ταχυδρομείο Ιατρού",

    // Validation helpers
    valid_email_helper: "Εισάγετε έγκυρο ηλεκτρονικό ταχυδρομείο",
    valid_mobile_helper: "Τηλέφωνο μεταξύ 7-15 ψηφίων",
    valid_dob_helper: "Η μορφή πρέπει να είναι ΕΕΕΕ-ΜΜ-ΗΗ",

    // Buttons/Saving
    save_button: "Αποθήκευση",
    saving: "Αποθήκευση...",

    // Alerts
    alert_validation_title: "Επικύρωση",
    alert_validation_msg:
      "Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία σωστά.",
    alert_error_title: "Σφάλμα",
    alert_fetch_error: "Αποτυχία λήψης δεδομένων χρήστη",
    alert_update_failed: "Η ενημέρωση απέτυχε",
    alert_update_error: "Αποτυχία ενημέρωσης χρήστη",
    alert_success_title: "Επιτυχία",
    alert_update_success: "Ο χρήστης ενημερώθηκε επιτυχώς",

    // Session
    session_expired_title: "Η συνεδρία έληξε",
    session_expired_msg: "Παρακαλώ συνδεθείτε ξανά.",
  },
};

/**
 * Helper to get the profile screen translation object based on the selected language name.
 * @param {string} language - "English" or "Greek"
 */
export const getProfileTranslations = (language) => {
  const langKey = language === "Greek" ? "gr" : "en";
  return PROFILE_TRANSLATIONS[langKey] || PROFILE_TRANSLATIONS.en;
};

// Localization Data for Tab Names
export const TAB_NAMES_TRANSLATIONS = {
  en: {
    Home: "Home",
    History: "History",
    Log: "Log",
    Profile: "Profile",
  },
  gr: {
    Home: "Αρχική",
    History: "Ιστορικό",
    Log: "Καταγραφή",
    Profile: "Προφίλ",
  },
};

/**
 * Helper to get the tab names translation object based on the selected language name.
 * @param {string} language - "English" or "Greek"
 */
export const getTabNamesTranslations = (language) => {
  const langKey = language === "Greek" ? "gr" : "en";
  return TAB_NAMES_TRANSLATIONS[langKey] || TAB_NAMES_TRANSLATIONS.en;
};
