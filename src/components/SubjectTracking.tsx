import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';

const subjectData = {
  TYT: {
    'Dil Bilgisi': { 
      topics: [
        'Sözcükte Anlam',
        'Cümlede Anlam',
        'Paragrafta Anlam',
        'Paragraf\'ın Yapısı',
        'Ses Bilgisi',
        'Yazım Kuralları',
        'Noktalama İşaretleri',
        'Biçim Bilgisi',
        'İsim',
        'Sıfat',
        'Zamir',
        'İsim ve Sıfat Tamlamaları',
        'Zarf',
        'Edat, Bağlaç, Ünlem',
        'Fiilde Kip',
        'Ek-Fiil',
        'Fiilde Yapı',
        'Fiilimsiler',
        'Fiilde Çatı',
        'Cümlenin Ögeleri',
        'Cümle Türleri',
        'Anlatım Bozukluğu'
      ] 
    },
    'Tarih': { 
      topics: [
        'Tarih ve Zaman',
        'İnsanlığın İlk Dönemleri',
        'Ortaçağ’da Dünya',
        'İlk ve Orta Çağlarda Türk Dünyası',
        'İslam Medeniyetinin Doğuşu',
        'İlk Türk İslam Devletleri',
        'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi',
        'Beylikten Devlete Osmanlı Siyaseti (1300-1453)',
        'Dünya Gücü Osmanlı Devleti (1453-1600)',
        'Yeni Çağ Avrupa Tarihi',
        'Yakın Çağ Avrupa Tarihi',
        'Osmanlı Devletinde Arayış Yılları',
        '18. Yüzyılda Değişim ve Diplomasi',
        'En Uzun Yüzyıl',
        'Osmanlı Kültür ve Medeniyeti',
        '20. Yüzyılda Osmanlı Devleti',
        'I. Dünya Savaşı',
        'Mondros Ateşkesi, İşgaller ve Cemiyetler',
        'Kurtuluş Savaşına Hazırlık Dönemi',
        'I. TBMM Dönemi',
        'Kurtuluş Savaşı ve Antlaşmalar',
        'II. TBMM Dönemi ve Çok Partili Hayata Geçiş',
        'Türk İnkılabı',
        'Atatürk İlkeleri',
        'Atatürk Dönemi Türk Dış Politikası'
      ] 
    },

    'Coğrafya': { 
      topics: [
        'Doğa ve İnsan',
        'Dünyanın Şekli ve Hareketleri',
        'Harita Bilgisi',
        'Atmosfer ve Sıcaklık',
        'İklimler',
        'Basınç ve Rüzgarlar',
        'Nem, Yağış ve Buharlaşma',
        'İç Kuvvetler / Dış Kuvvetler',
        'Su, Toprak ve Bitkiler',
        'Nüfus',
        'Göç',
        'Yerleşme',
        'Türkiye’nin Yer Şekilleri',
        'Ekonomik Faaliyetler',
        'Bölgeler',
        'Uluslararası Ulaşım Hatları',
        'Çevre ve Toplum',
        'Doğal Afetler',
      ] 
    },
    'Din': { 
      topics: [
        'Bilgi ve İnanç',
        'Din ve İslam',
        'İslam ve İbadet',
        'Gençlik ve Değerler',
        'Allah İnsan İlişkisi',
        'Hz. Muhammed (S.A.V)',
        'Vahiy ve Akıl',
        'İslam Düşüncesinde İtikadi, Siyasi ve Fıkhi Yorumlar',
        'Din, Kültür ve Medeniyet'
      ] 
    },
    'Felsefe': { 
      topics: [
        'Felsefe\'nin Konusu ve Alanı',
        'Bilgi Felsefesi',
        'Varlık Felsefesi',
        'Ahlak Felsefesi',
        'Sanat Felsefesi',
        'Din Felsefesi',
        'Siyaset Felsefesi',
        'Bilim Felsefesi'
      ] 
    },
    'Matematik': { 
      topics: [
        'Sayılar',
        'Sayı Basamakları',
        'Bölme ve Bölünebilme',
        'OBEB-OKEK',
        'Rasyonel Sayılar',
        'Basit Eşitsizlikler',
        'Mutlak Değer',
        'Üslü Sayılar',
        'Köklü Sayılar',
        'Çarpanlara Ayırma',
        'Oran Orantı',
        'Denklem Çözme',
        'Sayı Problemleri',
        'Kesir Problemleri',
        'Yaş Problemleri',
        'İşçi Problemleri',
        'Yüzde Problemleri',
        'Kar-Zarar Problemleri',
        'Karışım Problemleri',
        'Hareket Problemleri',
        'Rutin Olmayan Problemler',
        'Kümeler',
        'Fonksiyonlar',
        'Permütasyon',
        'Kombinasyon',
        'Binom',
        'Olasılık',
        'Veri ve İstatistik',
        '2. Dereceden Denklemler',
        'Karmaşık Sayılar',
        'Polinomlar'
      ] 
    },
    'Geometri': { 
      topics: [
        'Doğruda ve Üçgende Açılar',
        'Dik ve Özel Üçgenler',
        'Dik Üçgende Trigonometrik Bağıntılar',
        'İkizkenar ve Eşkenar Üçgen',
        'Üçgende Alanlar',
        'Üçgende Açıortay Bağıntıları',
        'Üçgende Kenarortay Bağıntıları',
        'Üçgende Eşlik ve Benzerlik',
        'Üçgende Açı-Kenar Bağıntıları',
        'Çokgenler',
        'Dörtgenler',
        'Yamuk',
        'Paralelkenar',
        'Eşkenar Dörtgen ve Deltoid',
        'Dikdörtgen',
        'Katı Cisimler'
      ] 
    },
    'Fizik': { 
      topics: [
        'Fizik Bilimine Giriş',
        'Madde ve Özkütle',
        'Dayanıklılık',
        'Adezyon ve Kohezyon',
        'Hareket',
        'Kuvvet',
        'Newton\'un Hareket Yasaları',
        'Sürtünme Kuvveti',
        'İş, Güç ve Enerji',
        'Mekanik Enerji',
        'Enerjinin Korunumu ve Enerji Dönüşümleri',
        'Verim',
        'Enerji Kaynakları',
        'Isı ve Sıcaklık',
        'Hal Değişimi',
        'Isıl Denge',
        'Enerji İletim Yolları ve Enerji Tüketim Hızı',
        'Genleşme',
        'Elektrik Yükü',
        'Elektrikle Yüklenme Çeşitleri',
        'Elektroskop',
        'İletken ve Yalıtkanlarda Yük Dağılımı',
        'Topraklama',
        'Coulomb Kuvveti',
        'Elektrik Alanı',
        'Elektrik Akımı, Potansiyel Farkı ve Direnci',
        'Elektrik Devreleri',
        'Mıknatıs ve Manyetik Alan',
        'Akım ve Manyetik Alan',
        'Basınç',
        'Kaldırma Kuvveti',
        'Temel Dalga Bilgileri',
        'Yay Dalgası',
        'Su Dalgası',
        'Ses Dalgası',
        'Deprem Dalgaları',
        'Aydınlanma',
        'Gölge',
        'Yansıma',
        'Düzlem Ayna',
        'Kırılma',
        'Mercekler',
        'Prizmalar'
      ] 
    },
    'Kimya': { 
      topics: [
        'Kimya Bilimine Giriş',
        'Atom ve Yapısı',
        'Periyodik Sistem',
        'Kimyasal Türler Arası Etkileşimler',
        'Asitler-Bazlar ve Tuzlar',
        'Bileşikler',
        'Kimyasal Tepkimeler',
        'Kimyanın Temel Yasaları',
        'Maddenin Halleri',
        'Karışımlar',
        'Endüstride ve Canlılarda Enerji',
        'Kimya Her Yerde'
      ] 
    },
    'Biyoloji': { 
      topics: [
        'Biyoloji Bilimi, İnorganik Bileşikler',
        'Organik Bileşikler',
        'Hücre',
        'Madde Geçişleri',
        'DNA-RNA',
        'Protein Sentezi',
        'Enzimler',
        'Canlıların Sınıflandırılması',
        'Hücre Bölünmeleri',
        'Eşeysiz-Eşeyli Üreme',
        'Ekoloji',
        'Kalıtım'
      ] 
    }
  },
  AYT: {
    'Edebiyat': { 
      topics: [
        'Anlam Bilgisi',
        'Dil Bilgisi',
        'Güzel Sanatlar ve Edebiyat',
        'Metinlerin Sınıflandırılması',
        'Şiir Bilgisi',
        'Edebi Sanatlar',
        'Türk Edebiyatı Dönemleri',
        'İslamiyet Öncesi Türk Edebiyatı ve Geçiş Dönemi',
        'Halk Edebiyatı',
        'Divan Edebiyatı',
        'Tanzimat Edebiyatı',
        'Servet-i Fünun Edebiyatı',
        'Fecr-i Ati Edebiyatı',
        'Milli Edebiyat',
        'Cumhuriyet Dönemi Edebiyatı',
        'Edebiyat Akımları',
        'Dünya Edebiyatı'
        
      ] 
    },
    'Tarih-1': { 
      topics: [
        'Tarih Bilimine Giriş',
        'Uygarlığın Doğuşu ve İlk Uygarlıklar',
        'İlk Türk Devletleri',
        'İslam Tarihi ve Uygarlığı',
        'Türk-İslam Devletleri',
        'Türkiye Tarihi',
        'Beylikten Devlete (1300-1453)',
        'Dünya Gücü: Osmanlı Devleti (1453-1600)',
        'Arayış Yılları (17. Yüzyıl)',
        'Avrupa ve Osmanlı Devleti (18. Yüzyıl)',
        'En Uzun Yüzyıl (1800-1922)',
        'Osmanlı Kültür ve Medeniyeti',
        '1881’den 1919’a Mustafa Kemal',
        'Milli Mücadele’nin Hazırlık Dönemi',
        'Kurtuluş Savaşı’nda Cepheler',
        'Türk İnkılabı',
        'Atatürkçülük ve Atatürk İlkeleri',
        'İki Savaş Arasındaki Dönemde Türkiye ve Dünya',
        'II. Dünya Savaşı Sürecinde Türkiye ve Dünya',
        'II. Dünya Savaşı Sonrasında Türkiye ve Dünya',
        'Toplumsal Devrim Çağında Dünya ve Türkiye',
        '21. Yüzyılın Eşiğinde Türkiye ve Dünya'
      ] 
    },
    'Tarih-2': { 
      topics: [
        'Tarih Bilimine Giriş',
        'Uygarlığın Doğuşu ve İlk Uygarlıklar',
        'İlk Türk Devletleri',
        'İslam Tarihi ve Uygarlığı',
        'Türk-İslam Devletleri',
        'Türkiye Tarihi',
        'Osmanlı Tarihi',
        '1881’den 1919’a Mustafa Kemal',
        'Milli Mücadele’nin Hazırlık Dönemi',
        'Kurtuluş Savaşı’nda Cepheler',
        'Türk İnkılabı',
        'Atatürkçülük ve Atatürk İlkeleri',
        'İki Savaş Arasındaki Dönemde Türkiye ve Dünya',
        'II. Dünya Savaşı Sürecinde Türkiye ve Dünya',
        'II. Dünya Savaşı Sonrasında Türkiye ve Dünya',
        'Toplumsal Devrim Çağında Dünya ve Türkiye',
        '21. Yüzyılın Eşiğinde Türkiye ve Dünya'
      ] 
    },

    'Coğrafya-1': { 
      topics: [
        'Doğa ve İnsan',
        'Dünya\'nın Şekli ve Hareketleri',
        'Coğrafi Konum',
        'Harita Bilgisi',
        'İklim Bilgisi',
        'Yerin Şekillenmesi',
        'Doğanın Varlıkları',
        'Beşeri Yapı',
        'Nüfusun Gelişimi, Dağılışı ve Niteliği',
        'Göçlerin Nedenleri ve Sonuçları',
        'Geçim Tarzları',
        'Türkiye\'nin Yeryüzü Şekilleri ve Özellikleri',
        'Türkiye İklimi ve Özellikleri',
        'Türkiye\'nin Doğal Varlıkları',
        'Türkiye\'de Yerleşme, Nüfus ve Göç'
      ] 
    },
    'Coğrafya-2': { 
      topics: [
        'Doğa ve İnsan',
        'Dünya\'nın Şekli ve Hareketleri',
        'Coğrafi Konum',
        'Harita Bilgisi',
        'İklim Bilgisi',
        'Yerin Şekillenmesi',
        'Doğanın Varlıkları',
        'Beşeri Yapı',
        'Nüfusun Gelişimi, Dağılışı ve Niteliği',
        'Göçlerin Nedenleri ve Sonuçları',
        'Geçim Tarzları',
        'Türkiye\'nin Yeryüzü Şekilleri ve Özellikleri',
        'Türkiye İklimi ve Özellikleri',
        'Türkiye\'nin Doğal Varlıkları',
        'Türkiye\'de Yerleşme, Nüfus ve Göç',
        'Bölge Türleri ve Sınırları',
        'Konum ve Etkileşim',
        'Coğrafi Keşifler',
        'Doğa ile İnsan Arasındaki Etkileşim',
        'Doğal Afetler',
        'Ekonomik Faaliyetler'
      ] 
    },
    'Felsefe': { 
      topics: [
        'Felsefenin Alanı',
        'Bilgi Felsefesi',
        'Bilim Felsefesi',
        'Varlık Felsefesi',
        'Ahlak Felsefesi',
        'Siyaset Felsefesi',
        'Sanat Felsefesi',
        'Din Felsefesi',
        'Mantığa Giriş',
        'Klasik Mantık',
        'Mantık ve Dil',
        'Sembolik Mantık',
        'Psikolojinin Temel Süreçleri',
        'Öğrenme Bellek Düşünme',
        'Ruh Sağlığının Temelleri',
        'Birey ve Toplum',
        'Toplumsal Yapı',
        'Toplumsal Değişme ve Gelişme',
        'Toplum ve Kültür',
        'Toplumsal Kurumlar'
      ] 
    },
    'Din': { 
      topics: [
        'Kur\'an-ı Kerim\'in Anlaşılması ve Kavranması',
        'İnsan ve Din',
        'İslam ve İbadetler',
        'İslam Düşüncesinde Yorumlar, Mezhepler',
        'Muhammed\'in Hayatı, Örnekliği ve Onu Anlama',
        'İslam ve Bilim, Estetik, Barış',
        'Yaşayan Dinler ve Benzer Özellikleri'
      ] 
    },
    'Matematik': { 
      topics: [
        'Temel Kavramlar',
        'Sayı Basamakları',
        'Rasyonel Sayılar',
        'Ondalıklı Sayılar',
        'Basit Eşitsizlikler',
        'Mutlak Değer',
        'Üslü Sayılar',
        'Köklü Sayılar',
        'Çarpanlara Ayırma',
        'Denklem Çözme',
        'Oran-Orantı',
        'Problemler',
        'Fonksiyonlar',
        'Kümeler',
        'Permütasyon',
        'Kombinasyon',
        'Binom',
        'Olasılık',
        'İstatistik',
        '2. Dereceden Denklemler',
        'Karmaşık Sayılar',
        'Parabol',
        'Polinomlar',
        'Mantık',
        'Eşitsizlikler',
        'Logaritma',
        'Diziler',
        'Seriler',
        'Limit ve Süreklilik',
        'Türev',
        'İntegral'
      ] 
    },
    'Geometri': { 
      topics: [
        'Doğruda ve Üçgende Açılar',
        'Dik ve Özel Üçgenler',
        'Dik Üçgende Trigonometrik Bağıntılar',
        'İkizkenar ve Eşkenar Üçgen',
        'Üçgende Alanlar',
        'Üçgende Açıortay Bağıntıları',
        'Üçgende Kenarortay Bağıntıları',
        'Üçgende Eşlik ve Benzerlik',
        'Üçgende Açı-Kenar Bağıntıları',
        'Çokgenler',
        'Dörtgenler',
        'Yamuk',
        'Paralelkenar',
        'Eşkenar Dörtgen – Deltoid',
        'Dikdörtgen',
        'Daire',
        'Prizmalar',
        'Piramitler',
        'Küre',
        'Noktanın Analitiği',
        'Doğrunun Analitiği',
        'Katı Cisimler (Uzay Geometri)',
        'Trigonometri',
        'Çemberde Açılar',
        'Çemberde Uzunluk',
        'Çemberin Analitiği'
      ] 
    },
    'Fizik': { 
      topics: [
        'Kuvvet ve Hareket',
        'Vektörler',
        'Bağıl Hareket',
        'Newton\'un Hareket Yasaları',
        'Bir Boyutta Sabit İvmeli Hareket',
        'İki Boyutta Sabit İvmeli Hareket',
        'Enerji ve Hareket',
        'İtme ve Çizgisel Momentum',
        'Tork',
        'Denge',
        'Basit Makineler',
        'Elektriksel Kuvvet ve Elektrik Alanı',
        'Elektriksel Potansiyel',
        'Düzgün Elektrik Alanı ve Sığa',
        'Manyetizma ve Elektromanyetik İndükleme',
        'Alternatif Akım',
        'Transformatörler',
        'Çembersel Hareket',
        'Dönme, Yuvarlanma ve Açısal Momentum',
        'Kütle Çekimi ve Kepler Kanunu',
        'Basit Harmonik Hareket',
        'Dalga Mekaniği ve Elektromanyetik Dalgalar',
        'Atom Modelleri',
        'Büyük Patlama ve Parçacık Fiziği',
        'Radyoaktivite',
        'Özel Görelilik',
        'Kara Cisim Işıması',
        'Fotoelektrik Olay ve Compton Olayı',
        'Modern Fiziğin Teknolojideki Uygulamaları'
      ] 
    },
    'Kimya': { 
      topics: [
        'Modern Atom Teorisi',
        'Kimyasal Hesaplamalar',
        'Gazlar',
        'Sıvı Çözeltiler',
        'Kimyasal Tepkimelerde Enerji',
        'Kimyasal Tepkimelerde Hız',
        'Kimyasal Tepkimelerde Denge',
        'Asit-Baz Dengesi',
        'Çözünürlük Dengesi',
        'Kimya ve Elektrik',
        'Organik Kimya\'ya Giriş',
        'Organik Kimya',
        'Hayatımızdaki Kimya'
      ] 
    },
    'Biyoloji': { 
      topics: [
        'Sinir Sistemi',
        'Endokrin Sistem ve Hormonlar',
        'Duyu Organları',
        'Destek ve Hareket Sistemi',
        'Sindirim Sistemi',
        'Dolaşım ve Bağışıklık Sistemi',
        'Solunum Sistemi',
        'Üriner Sistem (Boşaltım Sistemi)',
        'Üreme Sistemi ve Embriyonik Gelişim',
        'Komünite Ekolojisi',
        'Popülasyon Ekolojisi',
        'Genden Proteine',
        'Canlılarda Enerji Dönüşümleri',
        'Bitki Biyolojisi',
        'Canlılar ve Çevre'
      ] 
    }
  }
};

interface SubjectTrackingProps {
  onBack?: () => void;
}

export function SubjectTracking({ onBack }: SubjectTrackingProps) {
  const [activeTab, setActiveTab] = useState<'TYT' | 'AYT'>('TYT');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [topicStates, setTopicStates] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('yks_topic_states');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('yks_topic_states', JSON.stringify(topicStates));
  }, [topicStates]);

  const handleTopicToggle = (topic: string) => {
    setTopicStates(prev => ({
      ...prev,
      [topic]: !(prev[topic] || false)
    }));
  };

  
type Tab = keyof typeof subjectData; 
type Subject<T extends Tab> = keyof typeof subjectData[T]; 

const calculateProgress = (subject: Subject<typeof activeTab>) => {
  const topics = subjectData[activeTab][subject].topics;
  const completedCount = topics.filter(topic => topicStates[topic]).length;
  return Math.round((completedCount / topics.length) * 100);
};

if (
  selectedSubject &&
  subjectData[activeTab][selectedSubject as Subject<typeof activeTab>]
) {
  const subject = subjectData[activeTab][
    selectedSubject as Subject<typeof activeTab>
  ];


    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSelectedSubject(null)}
            className="hover:bg-blue-100"
          >
            <ArrowLeft className="w-5 h-5 text-blue-900" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{selectedSubject} Konuları</h1>
            <p className="text-slate-600">{activeTab} - {selectedSubject}</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-3">
              {subject.topics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => handleTopicToggle(topic)}
                >
                  <span className="font-medium text-slate-700">{topic}</span>
                  <div className="flex items-center">
                    {topicStates[topic] || false ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Konu Takip</h1>
        <p className="text-slate-600">İlerlemenizi takip edin ve konuları işaretleyin</p>
      </div>

      {/* Tab Buttons */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto">
        <Button
          type="button"
          variant={activeTab === 'TYT' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('TYT')}
          className={`px-8 py-2 rounded-lg transition-all ${
            activeTab === 'TYT' 
              ? 'bg-blue-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          TYT
        </Button>
        <Button
          type="button"
          variant={activeTab === 'AYT' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('AYT')}
          className={`px-8 py-2 rounded-lg transition-all ${
            activeTab === 'AYT' 
              ? 'bg-blue-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          AYT
        </Button>
      </div>

      {/* Subject Progress List */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Object.keys(subjectData[activeTab]).map((subject) => {
              const progress = calculateProgress(subject);
              return (
                <div
                  key={subject}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedSubject(subject)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-700">{subject}</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                      %{progress}
                    </Badge>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2 bg-slate-200"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
