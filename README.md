# 🍹 Mixologist Expert System

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

**Mixologist Expert System** adalah sebuah aplikasi sistem pakar berbasis web yang berfungsi selayaknya seorang *bartender* atau *mixologist* virtual. Sistem ini dapat memberikan rekomendasi racikan *mocktail* beserta status kelayakannya berdasarkan preferensi rasa, teknik *mixing*, dan bahan yang diinputkan oleh pengguna.

Proyek ini dibangun menggunakan metode inferensi **Forward Chaining** untuk menarik kesimpulan dari *rule base*, serta perhitungan **Certainty Factor (CF)** untuk menangani tingkat ketidakpastian (keyakinan) dari pengguna.

---

##  Fitur Utama

- ** Forward Chaining Engine:** Mesin inferensi logika yang memproses fakta secara berurutan berdasarkan 3 tahap *Rule Set* (Keseimbangan Rasa, Kecocokan Teknik, dan Rekomendasi Akhir).
- ** Certainty Factor (CF):** Menghitung persentase keyakinan sistem berdasarkan input keyakinan pengguna (Sangat Yakin hingga Tidak Yakin) menggunakan metode MYCIN.
- ** Explainable AI (XAI) / Transparansi Logika:** Pengguna dapat menekan tombol "Lihat Detail" untuk melihat *Decision Table*, *Working Memory*, dan langkah demi langkah perhitungan rumus matematis CF.
- ** Tema Gelap/Terang (Dark/Light Mode):** UI modern dengan dukungan *Premium Dark Theme* untuk kenyamanan visual pengguna.
- ** Responsif & Interaktif:** Desain *Two-Column Layout* yang otomatis menyesuaikan dengan ukuran layar (*mobile-friendly*), dilengkapi dengan animasi transisi yang mulus.

---

##  Teknologi yang Digunakan

Proyek ini murni menggunakan teknologi web fundamental (Vanilla) tanpa *framework* tambahan yang berat, sehingga sangat ringan dan cepat:

- **HTML5:** Struktur semantik antarmuka.
- **CSS3:** Gaya visual, *custom properties* (variabel CSS), *flexbox/grid*, dan animasi.
- **Vanilla JavaScript (ES6+):** Logika sistem pakar, manipulasi DOM, dan kalkulasi Certainty Factor.
- **Lucide Icons:** Pustaka ikon SVG sumber terbuka untuk mempercantik antarmuka.

---

<img width="846" height="758" alt="image" src="https://github.com/user-attachments/assets/0793223d-15ba-4da8-9cb2-dfe465f9d1e4" />
<img width="956" height="591" alt="image" src="https://github.com/user-attachments/assets/2e3f24e0-3601-4333-a00f-2887dea3ed76" />
<img width="1822" height="932" alt="image" src="https://github.com/user-attachments/assets/9fbf02ee-39b2-4618-a3c9-d2932ecd68f4" />
##  Struktur Berkas

```text
 mixologist-expert-system
├──  index.html    # Halaman utama antarmuka pengguna
├──  style.css     # Tata letak, warna, tipografi, dan tema gelap/terang
└──  script.js     # Knowledge Base (Fakta & Rules) dan Mesin Inferensi


