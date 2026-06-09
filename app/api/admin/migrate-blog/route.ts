import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// Shopify'dan çekilecek tarifler
const TARIFLER = [
  {
    baslik: 'Lavaşlı Tereyağlı Mini Gözleme',
    slug: 'lavasli-tereyagli-mini-gozleme',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Lavas_Gozleme.png?v=1747306151',
    etiketler: ['tereyağı', 'kahvaltı', 'pratik'],
    ozet: 'Hazır lavaş kullanarak dakikalar içinde hazırlayabileceğiniz enfes bir lezzet. Milgo sade tereyağı ile.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>4 yaprak hazır lavaş</li>
<li>2 yemek kaşığı <strong>Milgo sade tereyağı</strong></li>
<li>1 çay bardağı beyaz peynir (isteğe göre lor veya kaşar)</li>
<li>(İsteğe bağlı) ince kıyılmış maydanoz veya haşlanmış patates</li>
</ul>
<h2>Yapılışı</h2>
<p>Lavaşları tavada hafifçe yumuşatın. Bir kenarına iç harçtan (peynir ve isteğe bağlı maydanoz veya patates) koyun. Diğer kenarı üzerine kapatın ve kenarlarını çatal yardımıyla bastırarak kapatın. Tavada Milgo tereyağını eritin, gözlemeleri her iki tarafı da altın sarısı renk alana kadar pişirin.</p>`
  },
  {
    baslik: 'Milgo Çiğ Süt ile Sütlaç',
    slug: 'milgo-cig-sut-ile-sutlac',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Sutlac.jpg?v=1745234535',
    etiketler: ['çiğ süt', 'tatlı', 'geleneksel'],
    ozet: 'Milgo çiğ sütü ile hazırlanan geleneksel sütlaç tarifi. Doğal ve katkısız.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>1 litre <strong>Milgo Çiğ Süt</strong></li>
<li>1 çay bardağı pirinç</li>
<li>2 su bardağı su</li>
<li>1,5 çay bardağı toz şeker</li>
<li>1 paket vanilin</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Milgo çiğ sütü tencereye alın, kaynamaya başladıktan sonra ocaktan alın.</li>
<li>Başka bir tencerede pirinci 2 su bardağı su ile yumuşayana kadar haşlayın.</li>
<li>Pirinçler haşlandıktan sonra kaynatılmış sütü ekleyin, karıştırarak kaynatmaya devam edin.</li>
<li>Şeker ve vanilini ilave edin. Kıvam alana kadar ara ara karıştırarak pişirin.</li>
<li>Sütlaç kaselerine paylaştırın, oda sıcaklığına geldiğinde buzdolabında soğutun.</li>
</ol>
<h2>Servis Önerisi</h2>
<p>Soğuyan sütlacın üzerine isteğe göre tarçın serpebilir, fındık veya Hindistan cevizi ile süsleyebilirsiniz.</p>`
  },
  {
    baslik: 'Kakaolu Muhallebi',
    slug: 'kakaolu-muhallebi',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Kakaolu_Muhallebi.jpg?v=1745234615',
    etiketler: ['çiğ süt', 'tatlı', 'çocuklar için'],
    ozet: 'Milgo Çiğ Süt ile hazırlanan kakaolu muhallebi. Çocuklar için ideal.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>1 litre <strong>Milgo Çiğ Süt</strong></li>
<li>2 yemek kaşığı un</li>
<li>2 yemek kaşığı nişasta</li>
<li>3 yemek kaşığı kakao</li>
<li>1 su bardağı toz şeker</li>
<li>1 tatlı kaşığı <strong>Milgo tereyağı</strong> (isteğe bağlı)</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Milgo Çiğ Sütü tencereye alın ve kaynatın.</li>
<li>Ayrı bir kapta un, nişasta, kakao ve şekeri karıştırın.</li>
<li>Karışıma kaynayan sütten yavaş yavaş ekleyin. Topaklanmaması için sürekli çırpın.</li>
<li>Homojen hale gelen karışımı tekrar tencereye alın ve koyulaşana kadar karıştırarak pişirin.</li>
<li>Ocaktan alınca Milgo tereyağını ekleyip karıştırın.</li>
<li>Kaselere paylaştırın, ılındıktan sonra buzdolabında soğutun.</li>
</ol>
<h2>Servis Önerisi</h2>
<p>Üzerini Hindistan cevizi, rendelenmiş bitter çikolata ya da fındıkla süsleyerek servis edebilirsiniz.</p>`
  },
  {
    baslik: 'Beşamel Soslu Fırın Makarna',
    slug: 'besamel-soslu-firin-makarna',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Tavuklu_Sebzeli_Graten.jpg?v=1745234612',
    etiketler: ['çiğ süt', 'ana yemek', 'fırın'],
    ozet: 'Milgo çiğ sütü ile hazırlanan beşamel soslu fırın makarna. Doyurucu ve lezzetli.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>500 gram fırın makarna</li>
<li>1 litre <strong>Milgo Çiğ Süt</strong></li>
<li>2 yemek kaşığı tereyağı</li>
<li>2 yemek kaşığı un</li>
<li>Tuz, karabiber, muskat rendesi</li>
<li>1 su bardağı rendelenmiş kaşar peyniri</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Milgo Çiğ Sütü kaynatın ve kenarda bekletin.</li>
<li>Makarnayı tuzlu suda haşlayıp süzün.</li>
<li>Tencerede tereyağını eritip unu ekleyin ve unun kokusu çıkana kadar kavurun.</li>
<li>Kaynayan sütten azar azar ekleyerek hızlıca çırpın.</li>
<li>Tuz, karabiber ve muskat rendesini ekleyin. Kıvam alana kadar pişirin.</li>
<li>Haşlanan makarnayı beşamel sosla karıştırıp fırın kabına alın.</li>
<li>Üzerine kaşar serpip, 180°C fırında üstü kızarana kadar pişirin.</li>
</ol>`
  },
  {
    baslik: 'Kremalı Sebze Çorbası',
    slug: 'kremali-sebze-corbasi',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Sebze_Corbasi.jpg?v=1745234632',
    etiketler: ['çiğ süt', 'çorba', 'sağlıklı'],
    ozet: 'Milgo Çiğ Süt ile yapılan kremalı sebze çorbası. Besleyici ve yumuşacık.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 yemek kaşığı zeytinyağı</li>
<li>1 adet kuru soğan, 1 adet havuç, 1 adet kabak, 2 adet patates</li>
<li>1 litre <strong>Milgo Çiğ Süt</strong></li>
<li>2 su bardağı su</li>
<li>Tuz, karabiber</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Milgo Çiğ Sütü kaynatın ve kenarda bekletin.</li>
<li>Zeytinyağında soğanı kavurun, küp doğranmış sebzeleri ekleyip soteleyin.</li>
<li>Suyu ve kaynamış sütü ekleyin, sebzeler yumuşayana kadar pişirin.</li>
<li>Blender'dan geçirerek pürüzsüz hale getirin.</li>
<li>Tuz ve karabiberle tatlandırıp sıcak servis edin.</li>
</ol>`
  },
  {
    baslik: 'Limonlu Cheesecake',
    slug: 'limonlu-cheesecake',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Limonlu_Cheescake.jpg?v=1745234480',
    etiketler: ['tereyağı', 'peynir', 'tatlı'],
    ozet: 'Milgo Sade Tereyağı ve Sade Sürülebilir Peynir ile hazırlanan limonlu cheesecake.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>200 gram yulaflı bisküvi</li>
<li>75 gram eritilmiş <strong>Milgo Sade Tereyağı</strong></li>
<li>300 gram <strong>Milgo Sade Sürülebilir Peynir</strong></li>
<li>200 ml sıvı krema</li>
<li>3 yemek kaşığı pudra şekeri</li>
<li>1 adet limon kabuğu rendesi + 2 yemek kaşığı limon suyu</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Bisküvileri rondodan geçirin ve eritilmiş Milgo tereyağı ile karıştırın.</li>
<li>Kelepçeli kalıba bastırarak yayın ve buzdolabına alın.</li>
<li>Milgo sürülebilir peyniri, sıvı kremayı, pudra şekerini, limon rendesi ve suyunu pürüzsüz kıvam alana kadar çırpın.</li>
<li>Kremalı karışımı bisküvi tabanının üzerine dökün.</li>
<li>En az 4 saat (tercihen bir gece) buzdolabında dinlendirin.</li>
</ol>`
  },
  {
    baslik: 'Fırında Patlıcan Rulo',
    slug: 'firinda-patlican-rulo',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Patlican_Rulo.jpg?v=1745234455',
    etiketler: ['peynir', 'sebze', 'fırın'],
    ozet: 'Milgo Sade Sürülebilir Peynir ile hazırlanan hafif ve lezzetli patlıcan ruloları.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 adet uzun patlıcan</li>
<li>4 yemek kaşığı <strong>Milgo Sade Sürülebilir Peynir</strong></li>
<li>1 su bardağı domates sos</li>
<li>1 yemek kaşığı zeytinyağı, tuz</li>
<li>(İsteğe bağlı) ince doğranmış dereotu</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Patlıcanları ince şeritler halinde dilimleyin, tuzlayıp 10 dk bekletin.</li>
<li>Tavada veya fırında yumuşatın.</li>
<li>Her dilimin üzerine Milgo Sürülebilir Peynir sürün, rulo sarın.</li>
<li>Fırın kabına dizin, üzerine domates sosunu gezdirin.</li>
<li>180°C fırında 15-20 dakika pişirin.</li>
</ol>`
  },
  {
    baslik: 'Sebzeli Peynirli Quesadilla',
    slug: 'sebzeli-peynirli-quesadilla',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Peynirli_Quesadilla.jpg?v=1745234462',
    etiketler: ['peynir', 'pratik', 'öğle yemeği'],
    ozet: 'Milgo Sade Sürülebilir Peynir ile çıtır, akışkan quesadilla tarifi.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 adet tortilla ekmeği</li>
<li>3 yemek kaşığı <strong>Milgo Sade Sürülebilir Peynir</strong></li>
<li>½ adet kırmızı biber, 4-5 adet mantar, 2 yemek kaşığı mısır</li>
<li>1 yemek kaşığı zeytinyağı</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Zeytinyağında biber ve mantarı 3-4 dk soteleyin, mısırı ekleyin.</li>
<li>Tortilla'nın yarısına Milgo Sürülebilir Peynir sürün.</li>
<li>Sebzeleri yerleştirin, diğer yarısını kapatın.</li>
<li>Tavada her iki tarafını altın rengi alana kadar pişirin.</li>
</ol>`
  },
  {
    baslik: 'Kremalı Makarna',
    slug: 'kremali-makarna',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Kremali_Makarna.jpg?v=1745234468',
    etiketler: ['peynir', 'ana yemek', 'pratik'],
    ozet: 'Milgo Sade Sürülebilir Peynir ile dakikalar içinde hazırlanan kremalı makarna.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>250 gram makarna</li>
<li>3-4 yemek kaşığı <strong>Milgo Sade Sürülebilir Peynir</strong></li>
<li>½ su bardağı makarna suyu</li>
<li>Tuz, karabiber, (isteğe bağlı) muskat rendesi</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Makarnayı haşlayın ve suyundan yarım bardak ayırın.</li>
<li>Tavada Milgo sürülebilir peynir ile makarna suyunu ısıtın.</li>
<li>Haşlanmış makarnayı ekleyip harmanlayın.</li>
<li>Tuz ve karabiberle tatlandırıp sıcak servis edin.</li>
</ol>`
  },
  {
    baslik: 'Sarımsaklı Kekikli Peynirli Pizza',
    slug: 'sarimsakli-kekikli-peynirli-pizza',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Peynirli_Pizza.jpg?v=1745234475',
    etiketler: ['peynir', 'fırın', 'pizza'],
    ozet: 'Milgo Sarımsaklı Kekikli Peynir ile hazırlanan aromatik ev pizzası.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>1 adet hazır pizza hamuru</li>
<li>3 yemek kaşığı <strong>Milgo Sarımsaklı Kekikli Sürülebilir Peynir</strong></li>
<li>1 adet domates, ½ su bardağı mozzarella</li>
<li>1 yemek kaşığı zeytinyağı, tuz</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Pizza hamurunu tepsiye serin.</li>
<li>Üzerine Milgo Sarımsaklı Kekikli Peynir sürün.</li>
<li>Domates dilimlerini dizin, mozzarella serpin.</li>
<li>200°C fırında 15-20 dk pişirin.</li>
</ol>`
  },
  {
    baslik: 'Zeytinyağlı Kabak',
    slug: 'zeytinyagli-kabak',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Zeytinyagli_Kabak.jpg?v=1745234425',
    etiketler: ['peynir', 'sebze', 'hafif'],
    ozet: 'Milgo Sarımsaklı Kekikli Peynir ile aromatik zeytinyağlı kabak.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>3 adet kabak</li>
<li>3 yemek kaşığı <strong>Milgo Sarımsaklı Kekikli Sürülebilir Peynir</strong></li>
<li>2 yemek kaşığı zeytinyağı, tuz, pul biber</li>
</ul>
<h2>Hazırlanışı</h2>
<ol>
<li>Kabakları ince dilimleyip zeytinyağında soteleyin.</li>
<li>Üzerine Milgo Sarımsaklı Kekikli Peynir ekleyip karıştırın.</li>
<li>Tuz ve pul biberle tatlandırın, servis edin.</li>
</ol>`
  },
  {
    baslik: 'Tereyağlı Avokadolu Poşe Yumurta',
    slug: 'tereyagli-avokadolu-pose-yumurta',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Avokadolu_Pose_Yumurta.png?v=1747307378',
    etiketler: ['tereyağı', 'peynir', 'kahvaltı'],
    ozet: 'Milgo tereyağı ve sade peynir ile hazırlanan avokadolu poşe yumurta.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>1 dilim ekşi mayalı ekmek</li>
<li>1 yemek kaşığı <strong>Milgo sade tereyağı</strong></li>
<li>1 yemek kaşığı <strong>Milgo sade peynir</strong></li>
<li>Yarım olgun avokado</li>
<li>1 adet yumurta, 1 yemek kaşığı sirke</li>
</ul>
<h2>Yapılışı</h2>
<p>Tavada Milgo tereyağını eritin, ekmeği gezdirin. Üzerine Milgo Sade Peynir sürün. Avokadoyu dilimleyip ekmeğin üzerine yayın. Kaynayan suya sirke ekleyip girdap oluşturun, yumurtayı kırıp 2-3 dk pişirin. Yumurtayı avokadonun üzerine yerleştirin, pul biber serpin.</p>`
  },
  {
    baslik: 'Tereyağlı Muhlama',
    slug: 'tereyagli-muhlama',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Muhlama.png?v=1747307370',
    etiketler: ['tereyağı', 'Karadeniz', 'geleneksel'],
    ozet: 'Milgo sade tereyağı ile hazırlanan Karadeniz muhlaması.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 yemek kaşığı <strong>Milgo sade tereyağı</strong></li>
<li>2 yemek kaşığı mısır unu</li>
<li>1 su bardağı su</li>
<li>1 su bardağı rendelenmiş kolot peyniri</li>
</ul>
<h2>Yapılışı</h2>
<p>Tereyağını kısık ateşte eritip kavurun. Mısır ununu ekleyip kavurun. Suyu ekleyip karıştırarak pürüzsüz hale getirin. Peyniri ekleyin, karıştırmadan erimesini bekleyin. Peynir uzamaya başlayınca hazır! Mısır ekmeğiyle servis edin.</p>`
  },
  {
    baslik: 'Tereyağlı Pancake',
    slug: 'tereyagli-pancake',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Pancake.png?v=1747307350',
    etiketler: ['tereyağı', 'kahvaltı', 'tatlı'],
    ozet: 'Milgo sade tereyağı ve sütü ile hazırlanan yumuşacık pancake.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 yemek kaşığı eritilmiş <strong>Milgo sade tereyağı</strong></li>
<li>1 su bardağı Milgo süt, 1 adet yumurta</li>
<li>1,5 su bardağı un, 1 yemek kaşığı şeker, 1 paket kabartma tozu, vanilin, tuz</li>
</ul>
<h2>Yapılışı</h2>
<p>Yumurta ve şekeri çırpın. Sütü ve eritilmiş Milgo tereyağını ekleyin. Kuru malzemeleri ekleyip pürüzsüz kıvam alana kadar çırpın. Hafif yağlanmış tavaya bir kepçe dökün, göz göz olunca çevirin. Bal, meyve veya Milgo tereyağıyla servis edin.</p>`
  },
  {
    baslik: 'Tuzlu Tereyağlı Pirinç Pilavı',
    slug: 'tuzlu-tereyagli-pirinc-pilavi',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Pilav.png?v=1747309355',
    etiketler: ['tereyağı', 'ana yemek', 'geleneksel'],
    ozet: 'Milgo tuzlu tereyağı ile tane tane pirinç pilavı.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 su bardağı pirinç</li>
<li>1 yemek kaşığı <strong>Milgo tuzlu tereyağı</strong></li>
<li>3,5 su bardağı sıcak su, tuz</li>
</ul>
<h2>Yapılışı</h2>
<p>Pirinci yıkayıp süzün. Tereyağı ve az sıvı yağı tencerede ısıtın, pirinci kavurun. Suyu ekleyip kapağını kapatın, kısık ateşte pişirin. Demlendirip servis edin.</p>`
  },
  {
    baslik: 'Tereyağlı Kruvasan',
    slug: 'tereyagli-kruvasan',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/acaca.png?v=1747309047',
    etiketler: ['tereyağı', 'hamur işi', 'kahvaltı'],
    ozet: 'Milgo sade tereyağı ile kat kat yumuşacık ev yapımı kruvasan.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>500 g un, 1 paket maya, 3 yemek kaşığı şeker, 1 tatlı kaşığı tuz</li>
<li>1 su bardağı ılık Milgo süt, ½ su bardağı ılık su</li>
<li>2 yemek kaşığı <strong>Milgo Sade Tereyağı</strong> (hamura)</li>
<li>150 g <strong>Milgo Sade Tereyağı</strong> (katlama için)</li>
<li>1 adet yumurta (üzeri için)</li>
</ul>
<h2>Yapılışı</h2>
<p>Hamur malzemelerini yoğurun, 1 saat dinlendirin. Tereyağını ince tabaka halinde hamurun üzerine koyun, katlayın. Bu işlemi 3 kez tekrarlayın. Üçgen şekil verin, sarın. Yumurta sürüp 200°C fırında kızarana kadar pişirin.</p>`
  },
  {
    baslik: 'Laktozsuz Peynirli Zucchini Noodles',
    slug: 'laktozsuz-peynirli-zucchini-noodles',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Zucchini_Noodles.jpg?v=1751021400',
    etiketler: ['laktozsuz', 'sebze', 'hafif'],
    ozet: 'Milgo Laktozsuz Peynir ile hafif ve lezzetli kabak şeritleri.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 adet kabak</li>
<li>4 yemek kaşığı <strong>Milgo Laktozsuz Sürülebilir Peynir</strong></li>
<li>1 tatlı kaşığı zeytinyağı, 1 diş sarımsak, tuz, karabiber, fesleğen</li>
</ul>
<h2>Yapılışı</h2>
<p>Kabakları spiralize edin. Zeytinyağında sarımsağı soteleyin. Kabak şeritlerini ekleyip 2-3 dk pişirin. Milgo Laktozsuz Peyniri ekleyip karıştırın, tuz/karabiberle tatlandırın.</p>`
  },
  {
    baslik: 'Milgo Yaz Salatası',
    slug: 'milgo-yaz-salatasi',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Yaz_Salatasi.png?v=1751021411',
    etiketler: ['laktozsuz', 'salata', 'yaz'],
    ozet: 'Çilekli, laktozsuz peynirli ferahlatıcı yaz salatası.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>1 yeşil biber, 1 kırmızı biber, 1 salatalık, 6-8 çilek</li>
<li>½ su bardağı taze dereotu</li>
<li>4 yemek kaşığı <strong>Milgo Laktozsuz Sürülebilir Peynir</strong></li>
<li>1 yemek kaşığı zeytinyağı, limon suyu, tuz, karabiber</li>
</ul>
<h2>Yapılışı</h2>
<p>Sebze ve meyveleri doğrayın. Milgo Laktozsuz Peyniri küçük parçalar halinde ekleyin. Zeytinyağı, limon suyu, tuz ve karabiberle tatlandırıp soğuk servis edin.</p>`
  },
  {
    baslik: 'Laktozsuz Peynirli Frittata',
    slug: 'laktozsuz-peynirli-frittata',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/Fritatta.jpg?v=1751021565',
    etiketler: ['laktozsuz', 'kahvaltı', 'fırın'],
    ozet: 'Milgo Laktozsuz Peynir ile fırında hafif ve lezzetli frittata.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>4 adet yumurta</li>
<li>3 yemek kaşığı <strong>Milgo Laktozsuz Sürülebilir Peynir</strong></li>
<li>½ su bardağı yeşil biber, ½ su bardağı domates, ¼ su bardağı taze soğan</li>
<li>1 tatlı kaşığı zeytinyağı, tuz, karabiber</li>
</ul>
<h2>Yapılışı</h2>
<p>Fırını 180°C'ye ısıtın. Yumurtaları Milgo Laktozsuz Peynirle çırpın. Zeytinyağında sebzeleri soteleyin. Yumurta karışımını dökün, 3-4 dk tavada, sonra 15-20 dk fırında pişirin.</p>`
  },
  {
    baslik: 'Milgo\'lu Bonfile Lezzeti',
    slug: 'milgolu-bonfile-lezzeti',
    gorsel: 'https://cdn.shopify.com/s/files/1/0624/0767/1907/articles/6.png?v=1751022101',
    etiketler: ['peynir', 'et', 'özel gün'],
    ozet: 'Milgo Sarımsaklı Kekikli Peynir ile ızgara bonfile.',
    icerik: `<h2>Malzemeler</h2>
<ul>
<li>2 adet bonfile</li>
<li>3 yemek kaşığı <strong>Milgo Sarımsaklı Kekikli Sürülebilir Peynir</strong></li>
<li>1 yemek kaşığı zeytinyağı, tuz, karabiber</li>
</ul>
<h2>Yapılışı</h2>
<p>Bonfileleri oda sıcaklığında 10 dk bekletin. Zeytinyağı sürüp tuz/karabiber ekleyin. Izgarada her iki tarafı 4-5 dk pişirin. Üzerine Milgo Sarımsaklı Kekikli Peynir ekleyip erimesini bekleyin. Sıcak servis edin.</p>`
  }
]

export async function POST(req: NextRequest) {
  // Admin koruması
  const token = req.headers.get('x-chatbot-secret')
  if (token !== process.env.CHATBOT_SECRET) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const db = serviceClient()
  const sonuclar: Array<{ baslik: string; durum: string; gorsel_url?: string }> = []

  // 1. "Tarifler" kategorisi oluştur
  let kategori_id: string | null = null
  const { data: mevcutKat } = await db
    .from('site_blog_kategoriler')
    .select('id')
    .eq('slug', 'tarifler')
    .single()

  if (mevcutKat) {
    kategori_id = mevcutKat.id
  } else {
    const { data: yeniKat } = await db
      .from('site_blog_kategoriler')
      .insert({ name: 'Tarifler', slug: 'tarifler', aktif: true })
      .select('id')
      .single()
    kategori_id = yeniKat?.id || null
  }

  // 2. Her tarif için
  for (const tarif of TARIFLER) {
    try {
      // Mevcut kontrol
      const { data: mevcut } = await db
        .from('site_blog_yazilar')
        .select('id')
        .eq('slug', tarif.slug)
        .single()

      if (mevcut) {
        sonuclar.push({ baslik: tarif.baslik, durum: 'zaten var' })
        continue
      }

      // Görseli indir ve Supabase Storage'a yükle
      let gorsel_url = ''
      try {
        const imgResp = await fetch(tarif.gorsel)
        if (imgResp.ok) {
          const imgBuffer = await imgResp.arrayBuffer()
          const ext = tarif.gorsel.includes('.png') ? 'png' : 'jpg'
          const path = `blog/${tarif.slug}/kapak.${ext}`
          const contentType = ext === 'png' ? 'image/png' : 'image/jpeg'

          const { error: uploadErr } = await db.storage
            .from('site-medya')
            .upload(path, imgBuffer, { contentType, upsert: true })

          if (!uploadErr) {
            const { data: urlData } = db.storage.from('site-medya').getPublicUrl(path)
            gorsel_url = urlData.publicUrl
          }
        }
      } catch {
        // Görsel yüklenemezse boş bırak
      }

      // Blog yazısı ekle
      const { error: insertErr } = await db.from('site_blog_yazilar').insert({
        baslik: tarif.baslik,
        slug: tarif.slug,
        ozet: tarif.ozet,
        icerik: tarif.icerik,
        gorsel_url,
        kategori_id,
        durum: 'yayinda',
        etiketler: tarif.etiketler,
        seo_title: `${tarif.baslik} | Milgo Tarifler`,
        seo_description: tarif.ozet,
        okuma_suresi: 3,
        "yayın_tarihi": new Date().toISOString(),
      })

      if (insertErr) {
        sonuclar.push({ baslik: tarif.baslik, durum: `HATA: ${insertErr.message}` })
      } else {
        sonuclar.push({ baslik: tarif.baslik, durum: 'eklendi', gorsel_url })
      }
    } catch (e: any) {
      sonuclar.push({ baslik: tarif.baslik, durum: `HATA: ${e.message}` })
    }
  }

  return NextResponse.json({
    ok: true,
    kategori_id,
    toplam: sonuclar.length,
    eklenen: sonuclar.filter(s => s.durum === 'eklendi').length,
    mevcut: sonuclar.filter(s => s.durum === 'zaten var').length,
    hatali: sonuclar.filter(s => s.durum.startsWith('HATA')).length,
    detay: sonuclar
  })
}
