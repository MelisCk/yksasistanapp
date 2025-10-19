import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, Target, TrendingUp, BookOpen } from 'lucide-react';

const COLORS = ['#1e3a8a', '#1d4ed8'];

interface TestData {
  id: number;
  type: 'TYT' | 'AYT';
  tytNet: number;
  aytNet: number;
  date: string;
}

interface ProfileData {
  tytGoal: string;
  aytGoal: string;
  examType?: string;
  targetUniversity?: string;
  targetDepartment?: string;
}

interface DashboardProps {
  user: { name: string; email: string };
}

export function Dashboard({ user }: DashboardProps) {
  const [tests, setTests] = useState<TestData[]>([]);
  const [topicStates, setTopicStates] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<ProfileData>({ tytGoal: '100', aytGoal: '50' });

  useEffect(() => {
    // Load data from localStorage
    const savedTests = localStorage.getItem('yks_tests');
    const savedTopics = localStorage.getItem('yks_topic_states');
    const savedProfile = localStorage.getItem('yks_profile');

    if (savedTests) setTests(JSON.parse(savedTests));
    if (savedTopics) setTopicStates(JSON.parse(savedTopics));
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile({ tytGoal: '100', aytGoal: '50' });
    }
  }, []);

  // Geri sayım hesaplama (örnek: 2025 YKS tarihi)
  const examDate = new Date('2025-06-15');
  const now = new Date();
  const timeDiff = examDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
  const hours = Math.max(0, Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600)));
  const minutes = Math.max(0, Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60)));

  // Calculate subject completion percentages
  const tytTopics = [
    // Dil Bilgisi
    'Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Paragraf\'ın Yapısı', 'Ses Bilgisi',
    'Yazım Kuralları', 'Noktalama İşaretleri', 'Biçim Bilgisi', 'İsim', 'Sıfat', 'Zamir',
    'İsim ve Sıfat Tamlamaları', 'Zarf', 'Edat, Bağlaç, Ünlem', 'Fiilde Kip', 'Ek-Fiil',
    'Fiilde Yapı', 'Fiilimsiler', 'Fiilde Çatı', 'Cümlenin Ögeleri', 'Cümle Türleri', 'Anlatım Bozukluğu',
    
    // Tarih
    'Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', 'Ortaçağ\'da Dünya', 'İlk ve Orta Çağlarda Türk Dünyası',
    'İslam Medeniyetinin Doğuşu', 'İlk Türk İslam Devletleri', 'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi',
    'Beylikten Devlete Osmanlı Siyaseti (1300-1453)', 'Dünya Gücü Osmanlı Devleti (1453-1600)',
    'Yeni Çağ Avrupa Tarihi', 'Yakın Çağ Avrupa Tarihi', 'Osmanlı Devletinde Arayış Yılları',
    '18. Yüzyılda Değişim ve Diplomasi', 'En Uzun Yüzyıl', 'Osmanlı Kültür ve Medeniyeti',
    '20. Yüzyılda Osmanlı Devleti', 'I. Dünya Savaşı', 'Mondros Ateşkesi, İşgaller ve Cemiyetler',
    'Kurtuluş Savaşına Hazırlık Dönemi', 'I. TBMM Dönemi', 'Kurtuluş Savaşı ve Antlaşmalar',
    'II. TBMM Dönemi ve Çok Partili Hayata Geçiş', 'Türk İnkılabı', 'Atatürk İlkeleri',
    'Atatürk Dönemi Türk Dış Politikası',
    
    // Coğrafya
    'Doğa ve İnsan', 'Dünyanın Şekli ve Hareketleri', 'Harita Bilgisi', 'Atmosfer ve Sıcaklık',
    'İklimler', 'Basınç ve Rüzgarlar', 'Nem, Yağış ve Buharlaşma', 'İç Kuvvetler / Dış Kuvvetler',
    'Su, Toprak ve Bitkiler', 'Nüfus', 'Göç', 'Yerleşme', 'Türkiye\'nin Yer Şekilleri',
    'Ekonomik Faaliyetler', 'Bölgeler', 'Uluslararası Ulaşım Hatları', 'Çevre ve Toplum', 'Doğal Afetler',
    
    // Din
    'Bilgi ve İnanç', 'Din ve İslam', 'İslam ve İbadet', 'Gençlik ve Değerler', 'Allah İnsan İlişkisi',
    'Hz. Muhammed (S.A.V)', 'Vahiy ve Akıl', 'İslam Düşüncesinde İtikadi, Siyasi ve Fıkhi Yorumlar',
    'Din, Kültür ve Medeniyet',
    
    // Felsefe
    'Felsefe\'nin Konusu ve Alanı', 'Bilgi Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi',
    'Sanat Felsefesi', 'Din Felsefesi', 'Siyaset Felsefesi', 'Bilim Felsefesi',
    
    // Matematik
    'Sayılar', 'Sayı Basamakları', 'Bölme ve Bölünebilme', 'OBEB-OKEK', 'Rasyonel Sayılar',
    'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma',
    'Oran Orantı', 'Denklem Çözme', 'Sayı Problemleri', 'Kesir Problemleri', 'Yaş Problemleri',
    'İşçi Problemleri', 'Yüzde Problemleri', 'Kar-Zarar Problemleri', 'Karışım Problemleri',
    'Hareket Problemleri', 'Rutin Olmayan Problemler', 'Kümeler', 'Fonksiyonlar', 'Permütasyon',
    'Kombinasyon', 'Binom', 'Olasılık', 'Veri ve İstatistik', '2. Dereceden Denklemler',
    'Karmaşık Sayılar', 'Polinomlar',
    
    // Geometri
    'Doğruda ve Üçgende Açılar', 'Dik ve Özel Üçgenler', 'Dik Üçgende Trigonometrik Bağıntılar',
    'İkizkenar ve Eşkenar Üçgen', 'Üçgende Alanlar', 'Üçgende Açıortay Bağıntıları',
    'Üçgende Kenarortay Bağıntıları', 'Üçgende Eşlik ve Benzerlik', 'Üçgende Açı-Kenar Bağıntıları',
    'Çokgenler', 'Dörtgenler', 'Yamuk', 'Paralelkenar', 'Eşkenar Dörtgen ve Deltoid', 'Dikdörtgen',
    'Katı Cisimler',
    
    // Fizik
    'Fizik Bilimine Giriş', 'Madde ve Özkütle', 'Dayanıklılık', 'Adezyon ve Kohezyon', 'Hareket',
    'Kuvvet', 'Newton\'un Hareket Yasaları', 'Sürtünme Kuvveti', 'İş, Güç ve Enerji', 'Mekanik Enerji',
    'Enerjinin Korunumu ve Enerji Dönüşümleri', 'Verim', 'Enerji Kaynakları', 'Isı ve Sıcaklık',
    'Hal Değişimi', 'Isıl Denge', 'Enerji İletim Yolları ve Enerji Tüketim Hızı', 'Genleşme',
    'Elektrik Yükü', 'Elektrikle Yüklenme Çeşitleri', 'Elektroskop', 'İletken ve Yalıtkanlarda Yük Dağılımı',
    'Topraklama', 'Coulomb Kuvveti', 'Elektrik Alanı', 'Elektrik Akımı, Potansiyel Farkı ve Direnci',
    'Elektrik Devreleri', 'Mıknatıs ve Manyetik Alan', 'Akım ve Manyetik Alan', 'Basınç', 'Kaldırma Kuvveti',
    'Temel Dalga Bilgileri', 'Yay Dalgası', 'Su Dalgası', 'Ses Dalgası', 'Deprem Dalgaları', 'Aydınlanma',
    'Gölge', 'Yansıma', 'Düzlem Ayna', 'Kırılma', 'Mercekler', 'Prizmalar',
    
    // Kimya
    'Kimya Bilimine Giriş', 'Atom ve Yapısı', 'Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler',
    'Asitler-Bazlar ve Tuzlar', 'Bileşikler', 'Kimyasal Tepkimeler', 'Kimyanın Temel Yasaları',
    'Maddenin Halleri', 'Karışımlar', 'Endüstride ve Canlılarda Enerji', 'Kimya Her Yerde',
    
    // Biyoloji
    'Biyoloji Bilimi, İnorganik Bileşikler', 'Organik Bileşikler', 'Hücre', 'Madde Geçişleri',
    'DNA-RNA', 'Protein Sentezi', 'Enzimler', 'Canlıların Sınıflandırılması', 'Hücre Bölünmeleri',
    'Eşeysiz-Eşeyli Üreme', 'Ekoloji', 'Kalıtım'
  ];
  
  const aytTopics = [
    // Edebiyat
    'Anlam Bilgisi', 'Dil Bilgisi', 'Güzel Sanatlar ve Edebiyat', 'Metinlerin Sınıflandırılması',
    'Şiir Bilgisi', 'Edebi Sanatlar', 'Türk Edebiyatı Dönemleri', 'İslamiyet Öncesi Türk Edebiyatı ve Geçiş Dönemi',
    'Halk Edebiyatı', 'Divan Edebiyatı', 'Tanzimat Edebiyatı', 'Servet-i Fünun Edebiyatı',
    'Fecr-i Ati Edebiyatı', 'Milli Edebiyat', 'Cumhuriyet Dönemi Edebiyatı', 'Edebiyat Akımları', 'Dünya Edebiyatı',
    
    // Tarih-1
    'Tarih Bilimine Giriş', 'Uygarlığın Doğuşu ve İlk Uygarlıklar', 'İlk Türk Devletleri',
    'İslam Tarihi ve Uygarlığı', 'Türk-İslam Devletleri', 'Türkiye Tarihi', 'Beylikten Devlete (1300-1453)',
    'Dünya Gücü: Osmanlı Devleti (1453-1600)', 'Arayış Yılları (17. Yüzyıl)', 'Avrupa ve Osmanlı Devleti (18. Yüzyıl)',
    'En Uzun Yüzyıl (1800-1922)', 'Osmanlı Kültür ve Medeniyeti', '1881\'den 1919\'a Mustafa Kemal',
    'Milli Mücadele\'nin Hazırlık Dönemi', 'Kurtuluş Savaşı\'nda Cepheler', 'Türk İnkılabı',
    'Atatürkçülük ve Atatürk İlkeleri', 'İki Savaş Arasındaki Dönemde Türkiye ve Dünya',
    'II. Dünya Savaşı Sürecinde Türkiye ve Dünya', 'II. Dünya Savaşı Sonrasında Türkiye ve Dünya',
    'Toplumsal Devrim Çağında Dünya ve Türkiye', '21. Yüzyılın Eşiğinde Türkiye ve Dünya',
    
    // Coğrafya-1 ve Coğrafya-2
    'Doğa ve İnsan', 'Dünya\'nın Şekli ve Hareketleri', 'Coğrafi Konum', 'Harita Bilgisi',
    'İklim Bilgisi', 'Yerin Şekillenmesi', 'Doğanın Varlıkları', 'Beşeri Yapı',
    'Nüfusun Gelişimi, Dağılışı ve Niteliği', 'Göçlerin Nedenleri ve Sonuçları', 'Geçim Tarzları',
    'Türkiye\'nin Yeryüzü Şekilleri ve Özellikleri', 'Türkiye İklimi ve Özellikleri',
    'Türkiye\'nin Doğal Varlıkları', 'Türkiye\'de Yerleşme, Nüfus ve Göç', 'Bölge Türleri ve Sınırları',
    'Konum ve Etkileşim', 'Coğrafi Keşifler', 'Doğa ile İnsan Arasındaki Etkileşim', 'Doğal Afetler',
    'Ekonomik Faaliyetler',
    
    // Felsefe
    'Felsefenin Alanı', 'Bilgi Felsefesi', 'Bilim Felsefesi', 'Varlık Felsefesi', 'Ahlak Felsefesi',
    'Siyaset Felsefesi', 'Sanat Felsefesi', 'Din Felsefesi', 'Mantığa Giriş', 'Klasik Mantık',
    'Mantık ve Dil', 'Sembolik Mantık', 'Psikolojinin Temel Süreçleri', 'Öğrenme Bellek Düşünme',
    'Ruh Sağlığının Temelleri', 'Birey ve Toplum', 'Toplumsal Yapı', 'Toplumsal Değişme ve Gelişme',
    'Toplum ve Kültür', 'Toplumsal Kurumlar',
    
    // Din
    'Kur\'an-ı Kerim\'in Anlaşılması ve Kavranması', 'İnsan ve Din', 'İslam ve İbadetler',
    'İslam Düşüncesinde Yorumlar, Mezhepler', 'Muhammed\'in Hayatı, Örnekliği ve Onu Anlama',
    'İslam ve Bilim, Estetik, Barış', 'Yaşayan Dinler ve Benzer Özellikleri',
    
    // Matematik
    'Temel Kavramlar', 'Sayı Basamakları', 'Rasyonel Sayılar', 'Ondalıklı Sayılar', 'Basit Eşitsizlikler',
    'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Denklem Çözme', 'Oran-Orantı',
    'Problemler', 'Fonksiyonlar', 'Kümeler', 'Permütasyon', 'Kombinasyon', 'Binom', 'Olasılık', 'İstatistik',
    '2. Dereceden Denklemler', 'Karmaşık Sayılar', 'Parabol', 'Polinomlar', 'Mantık', 'Eşitsizlikler',
    'Logaritma', 'Diziler', 'Seriler', 'Limit ve Süreklilik', 'Türev', 'İntegral',
    
    // Geometri
    'Doğruda ve Üçgende Açılar', 'Dik ve Özel Üçgenler', 'Dik Üçgende Trigonometrik Bağıntılar',
    'İkizkenar ve Eşkenar Üçgen', 'Üçgende Alanlar', 'Üçgende Açıortay Bağıntıları', 'Üçgende Kenarortay Bağıntıları',
    'Üçgende Eşlik ve Benzerlik', 'Üçgende Açı-Kenar Bağıntıları', 'Çokgenler', 'Dörtgenler', 'Yamuk',
    'Paralelkenar', 'Eşkenar Dörtgen – Deltoid', 'Dikdörtgen', 'Daire', 'Prizmalar', 'Piramitler', 'Küre',
    'Noktanın Analitiği', 'Doğrunun Analitiği', 'Katı Cisimler (Uzay Geometri)', 'Trigonometri',
    'Çemberde Açılar', 'Çemberde Uzunluk', 'Çemberin Analitiği',
    
    // Fizik
    'Kuvvet ve Hareket', 'Vektörler', 'Bağıl Hareket', 'Newton\'un Hareket Yasaları',
    'Bir Boyutta Sabit İvmeli Hareket', 'İki Boyutta Sabit İvmeli Hareket', 'Enerji ve Hareket',
    'İtme ve Çizgisel Momentum', 'Tork', 'Denge', 'Basit Makineler', 'Elektriksel Kuvvet ve Elektrik Alanı',
    'Elektriksel Potansiyel', 'Düzgün Elektrik Alanı ve Sığa', 'Manyetizma ve Elektromanyetik İndükleme',
    'Alternatif Akım', 'Transformatörler', 'Çembersel Hareket', 'Dönme, Yuvarlanma ve Açısal Momentum',
    'Kütle Çekimi ve Kepler Kanunu', 'Basit Harmonik Hareket', 'Dalga Mekaniği ve Elektromanyetik Dalgalar',
    'Atom Modelleri', 'Büyük Patlama ve Parçacık Fiziği', 'Radyoaktivite', 'Özel Görelilik',
    'Kara Cisim Işıması', 'Fotoelektrik Olay ve Compton Olayı', 'Modern Fiziğin Teknolojideki Uygulamaları',
    
    // Kimya
    'Modern Atom Teorisi', 'Kimyasal Hesaplamalar', 'Gazlar', 'Sıvı Çözeltiler', 'Kimyasal Tepkimelerde Enerji',
    'Kimyasal Tepkimelerde Hız', 'Kimyasal Tepkimelerde Denge', 'Asit-Baz Dengesi', 'Çözünürlük Dengesi',
    'Kimya ve Elektrik', 'Organik Kimya\'ya Giriş', 'Organik Kimya', 'Hayatımızdaki Kimya',
    
    // Biyoloji
    'Sinir Sistemi', 'Endokrin Sistem ve Hormonlar', 'Duyu Organları', 'Destek ve Hareket Sistemi',
    'Sindirim Sistemi', 'Dolaşım ve Bağışıklık Sistemi', 'Solunum Sistemi', 'Üriner Sistem (Boşaltım Sistemi)',
    'Üreme Sistemi ve Embriyonik Gelişim', 'Komünite Ekolojisi', 'Popülasyon Ekolojisi', 'Genden Proteine',
    'Canlılarda Enerji Dönüşümleri', 'Bitki Biyolojisi', 'Canlılar ve Çevre'
  ];

  const tytCompleted = tytTopics.filter(topic => topicStates[topic]).length;
  const aytCompleted = aytTopics.filter(topic => topicStates[topic]).length;
  const tytPercentage = Math.round((tytCompleted / tytTopics.length) * 100);
  const aytPercentage = Math.round((aytCompleted / aytTopics.length) * 100);

  const subjectData = [
    { name: 'TYT', completed: tytPercentage, total: 100 },
    { name: 'AYT', completed: aytPercentage, total: 100 }
  ];

  // Prepare chart data for TYT and AYT
  const tytTests = tests.filter(t => t.type === 'TYT');
  const aytTests = tests.filter(t => t.type === 'AYT');

  const tytChartData = tytTests.length > 0 ? tytTests.map((test, index) => ({
    name: new Date(test.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: test.tytNet,
    target: parseInt(profile.tytGoal) || 100,
    date: test.date
  })) : [{ name: '', net: 0, target: 0 }];

  const aytChartData = aytTests.length > 0 ? aytTests.map((test, index) => ({
    name: new Date(test.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: test.aytNet,
    target: parseInt(profile.aytGoal) || 50,
    date: test.date
  })) : [{ name: '', net: 0, target: 0 }];

  return (
    <div className="space-y-6">
      {/* Geri Sayım Kartı */}
      <Card className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-0 text-white shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">YKS'ye Kalan Süre</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{days}</div>
                <div className="text-sm opacity-90">Gün</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{hours}</div>
                <div className="text-sm opacity-90">Saat</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{minutes}</div>
                <div className="text-sm opacity-90">Dakika</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orta Bölüm - Konu Takip ve Profil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Konu Takip Kartı */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg">Konu Takip</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {subjectData.map((subject, index) => (
                <div key={subject.name} className="text-center space-y-2">
                  <h4 className="font-medium text-slate-700">{subject.name}</h4>
                  <div className="w-20 h-20 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: subject.completed },
                            { value: subject.total - subject.completed }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          dataKey="value"
                        >
                          <Cell fill={COLORS[index]} />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-slate-600">%{subject.completed}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profil Kartı */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-1.5">
              <Target className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg">Profil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {user.name.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-600">
                  {profile.targetUniversity || 'İTÜ'} - {profile.targetDepartment || 'Bilgisayar Mühendisliği'}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg inline-block">
                <span className="font-semibold">{profile.examType || 'SAY'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deneme Sonuçları Kartı */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-blue-900" />
            <CardTitle className="text-lg">Deneme Gelişimi</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-3 text-center">TYT</h4>
              <div className="h-32">
                {tytTests.length === 0 ? (
                  <div className="h-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ name: '', net: 0 }]}>
                        <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} />
                        <YAxis stroke="#cbd5e1" fontSize={12} />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="absolute text-xs text-slate-400">Henüz deneme yok</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tytChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 rounded shadow-lg border text-xs">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-blue-900">Net: {payload[0].value}</p>
                                <p className="text-orange-600">Hedef: {payload[0].payload.target}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="net" 
                        stroke="#1e3a8a" 
                        strokeWidth={3}
                        dot={{ fill: '#1e3a8a', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#f59e0b', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-3 text-center">AYT</h4>
              <div className="h-32">
                {aytTests.length === 0 ? (
                  <div className="h-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ name: '', net: 0 }]}>
                        <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} />
                        <YAxis stroke="#cbd5e1" fontSize={12} />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="absolute text-xs text-slate-400">Henüz deneme yok</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aytChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 rounded shadow-lg border text-xs">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-blue-700">Net: {payload[0].value}</p>
                                <p className="text-orange-600">Hedef: {payload[0].payload.target}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="net" 
                        stroke="#1d4ed8" 
                        strokeWidth={3}
                        dot={{ fill: '#1d4ed8', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#f59e0b', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
