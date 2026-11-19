CMS.registerLocale('ar', {
  auth: {
    login: 'تسجيل الدخول',
    loggingIn: 'جارٍ تسجيل الدخول...',
    loginWithGitHub: 'تسجيل الدخول باستخدام GitHub'
  },
  app: {
    header: {
      content: 'المحتوى',
      workflow: 'سير العمل',
      deploys: 'النشر',
      media: 'الوسائط',
      quickAdd: 'إضافة سريعة'
    },
    app: {
      errorHeader: 'تعذر تحميل إعدادات لوحة الإدارة',
      configErrors: 'أخطاء الإعدادات',
      checkConfigYml: 'راجع ملف config.yml.',
      loadingConfig: 'جارٍ تحميل الإعدادات...',
      waitingBackend: 'جارٍ الاتصال بمستودع GitHub...'
    }
  },
  collection: {
    sidebar: {
      collections: 'المجموعات',
      allCollections: 'كل المجموعات',
      searchAll: 'ابحث في الكل',
      searchIn: 'ابحث في'
    },
    collectionTop: {
      sortBy: 'ترتيب حسب',
      newButton: '＋ %{collectionLabel}',
      ascending: 'تصاعدي',
      descending: 'تنازلي',
      filterBy: 'تصفية حسب',
      groupBy: 'تجميع حسب'
    },
    entries: {
      loadingEntries: 'جارٍ تحميل المحتوى...',
      noEntries: 'لا توجد عناصر بعد'
    }
  },
  editor: {
    editorToolbar: {
      publish: 'نشر',
      published: 'منشور',
      unpublish: 'إلغاء النشر',
      saving: 'جارٍ الحفظ...',
      save: 'حفظ',
      deleting: 'جارٍ الحذف...',
      deleteEntry: 'حذف العنصر',
      backCollection: 'العودة إلى %{collectionLabel}',
      unsavedChanges: 'تغييرات غير محفوظة',
      changesSaved: 'تم حفظ التغييرات',
      draft: 'مسودة'
    },
    editor: {
      onLeavePage: 'هل تريد مغادرة الصفحة؟ ستفقد التغييرات غير المحفوظة.'
    },
    editorWidgets: {
      image: {
        choose: 'اختيار صورة',
        chooseMultiple: 'اختيار صور',
        chooseUrl: 'إضافة صورة من رابط',
        replaceUrl: 'تغيير الرابط',
        chooseDifferent: 'اختيار صورة أخرى',
        addMore: 'إضافة صور أخرى',
        remove: 'إزالة الصورة',
        removeAll: 'إزالة كل الصور'
      },
      list: {
        add: 'إضافة %{item}',
        addType: 'إضافة %{item}'
      },
      markdown: {
        bold: 'عريض',
        italic: 'مائل',
        link: 'رابط',
        headings: 'عناوين',
        bulletedList: 'قائمة نقطية',
        numberedList: 'قائمة مرقمة'
      }
    }
  },
  mediaLibrary: {
    mediaLibrary: {
      onDelete: 'هل تريد حذف الصور المحددة؟',
      fileTooLarge: 'حجم الملف أكبر من الحد المسموح.'
    },
    mediaLibraryModal: {
      loading: 'جارٍ التحميل...',
      close: 'إغلاق',
      noResults: 'لا توجد نتائج.',
      noAssetsFound: 'لا توجد ملفات.',
      noImagesFound: 'لا توجد صور.',
      images: 'الصور',
      mediaAssets: 'الملفات',
      search: 'بحث...',
      uploading: 'جارٍ رفع الصور...',
      upload: 'رفع',
      deleting: 'جارٍ الحذف...',
      deleteSelected: 'حذف المحدد',
      chooseSelected: 'اختيار المحدد'
    }
  },
  ui: {
    default: { goBackToSite: 'العودة إلى الموقع' },
    settingsDropdown: { logOut: 'تسجيل الخروج' },
    toast: {
      entrySaved: 'تم حفظ المحتوى',
      entryPublishing: 'تم الحفظ، جارٍ النشر...',
      onFailToPersist: 'تعذر حفظ المحتوى: %{details}',
      onFailToDelete: 'تعذر الحذف: %{details}',
      missingRequiredField: 'أكمل الحقول المطلوبة قبل الحفظ.'
    }
  }
});
