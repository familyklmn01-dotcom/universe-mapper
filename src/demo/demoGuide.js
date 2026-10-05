export const demoGuide = {
  id: 'universe-guided-demo-v2',
  title: 'Guided Demo — Universe Mapper',
  subtitle: 'Ikuti empat langkah singkat. Tekan Next setelah membaca dan mencoba langkah yang sedang ditunjukkan.',
  steps: [
    {
      id: 'select-node',
      title: '1. Pilih sebuah Node',
      text: 'Klik satu kali Node pada contoh Universe. Perhatikan Inspector di kanan: Properties Node muncul tanpa menggeser canvas. Setelah melihatnya, tekan Next.',
      target: 'node'
    },
    {
      id: 'edit-relationship',
      title: '2. Coba Relationship',
      text: 'Klik satu kali garis Relationship. Setelah Properties tampil, coba geser endpoint pada garis ke sisi lain Node (atas, kanan, bawah, atau kiri). Posisi endpoint mengikuti sisi yang Anda pilih. Setelah mencoba, tekan Next.',
      target: 'relationship'
    },
    {
      id: 'camera',
      title: '3. Coba Camera',
      text: 'Camera adalah posisi pandang yang disimpan. Klik menu Camera di toolbar atas, pilih “+ Save current” untuk menyimpan posisi pandangan sekarang, lalu pilih nama Camera tersebut untuk kembali ke posisi itu. Camera hanya mengubah sudut pandang/zoom, bukan data Node atau Relationship. Setelah mencoba, tekan Next.',
      target: 'camera'
    },
    {
      id: 'printout',
      title: '4. Coba Printout',
      text: 'Buka Printout dari menu View. Di sini Universe yang sama dibaca sebagai hasil struktur/hierarchy untuk output. Coba pan atau zoom, lalu kembali ke canvas. Setelah selesai, tekan Finish demo.',
      target: 'printout'
    }
  ],
  completionTitle: 'Demo telah berakhir',
  completionText: 'Untuk melanjutkan menggunakan Universe Mapper, silahkan sign in / login.',
  completionAction: 'Sign in / Login'
}

export const demoGuideStorageKey = 'um-guided-demo-v2'
