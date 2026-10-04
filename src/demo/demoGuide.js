export const demoGuide = {
  id: 'universe-guided-demo-v1',
  title: 'Guided Demo — Universe Mapper',
  subtitle: 'Ikuti langkah singkat ini untuk mengenal alur utama Universe Mapper.',
  steps: [
    {
      id: 'select-node',
      title: '1. Pilih sebuah Node',
      text: 'Klik satu kali Node pada contoh Universe. Properties akan muncul di Inspector kanan tanpa menggeser canvas.',
      target: 'node',
      autoAdvance: true
    },
    {
      id: 'select-relationship',
      title: '2. Pilih Relationship',
      text: 'Sekarang klik satu kali garis Relationship. Perhatikan Relationship Properties dan jangan mengubah garis kecuali Anda memang mengeditnya.',
      target: 'relationship',
      autoAdvance: true
    },
    {
      id: 'try-routing',
      title: '3. Coba edit jalur',
      text: 'Coba geser endpoint atau segment garis. Gunakan ini untuk melihat bagaimana routing manual bekerja.',
      target: 'interaction',
      autoAdvance: false
    },
    {
      id: 'camera',
      title: '4. Coba Camera',
      text: 'Buka Camera / Saved View dan coba berpindah fokus. Demo hanya membimbing; data contoh tetap menjadi contoh.',
      target: 'camera',
      autoAdvance: false
    },
    {
      id: 'printout',
      title: '5. Coba Printout',
      text: 'Buka Printout untuk melihat bagaimana Universe yang sama dapat dibaca sebagai struktur hierarchy.',
      target: 'printout',
      autoAdvance: false
    }
  ],
  completionTitle: 'Demo telah berakhir',
  completionText: 'Untuk melanjutkan menggunakan Universe Mapper, silahkan sign in / login.',
  completionAction: 'Sign in / Login'
}

export const demoGuideStorageKey = 'um-guided-demo-v1'
