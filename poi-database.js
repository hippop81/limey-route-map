/**
 * poi-database.js
 * Limey Route Map — POI Database v2.0（94件）
 * アングラちゃん調査 + たこくろちゃん整備
 *
 * 更新担当：たこくろちゃん
 * index.html は触らない。このファイルだけ更新すること。
 *
 * カテゴリ：
 *   event: 24件
 *   airport: 17件
 *   railway: 17件
 *   theme_park: 4件
 *   tourism: 11件
 *   landmark: 21件
 */

/* global var — index.html から <script src="./poi-database.js"> で読み込む */
var POI_DATABASE = [

  /* ─── Event Venues（遠征会場）（24件） ─── */
  {"name":"東京ドーム","name_en":"Tokyo Dome","lat":35.7034,"lng":139.7511,"category":"event","priority":1,"nearest_station":"水道橋","nearest_station_lat":35.702,"nearest_station_lng":139.754,"city":"tokyo","tags":["concert","baseball","dome"]},
  {"name":"京セラドーム大阪","name_en":"Kyocera Dome Osaka","lat":34.6693,"lng":135.4761,"category":"event","priority":1,"nearest_station":"ドーム前千代崎","nearest_station_lat":34.671,"nearest_station_lng":135.478,"city":"osaka","tags":["concert","baseball","dome"]},
  {"name":"さいたまスーパーアリーナ","name_en":"Saitama Super Arena","lat":35.8903,"lng":139.6252,"category":"event","priority":1,"nearest_station":"さいたま新都心","nearest_station_lat":35.8939,"nearest_station_lng":139.6336,"city":"saitama","tags":["concert","arena"]},
  {"name":"Kアリーナ横浜","name_en":"K-Arena Yokohama","lat":35.4644,"lng":139.6291,"category":"event","priority":1,"nearest_station":"新高島","nearest_station_lat":35.4597,"nearest_station_lng":139.6269,"city":"yokohama","tags":["concert","arena"]},
  {"name":"バンテリンドーム ナゴヤ","name_en":"Vantelin Dome Nagoya","lat":35.1849,"lng":136.9417,"category":"event","priority":1,"nearest_station":"ナゴヤドーム前矢田","nearest_station_lat":35.1903,"nearest_station_lng":136.9472,"city":"nagoya","tags":["concert","baseball","dome"]},
  {"name":"みずほPayPayドーム福岡","name_en":"Mizuho PayPay Dome Fukuoka","lat":33.5953,"lng":130.3622,"category":"event","priority":1,"nearest_station":"唐人町","nearest_station_lat":33.591,"nearest_station_lng":130.368,"city":"fukuoka","tags":["concert","baseball","dome"]},
  {"name":"横浜アリーナ","name_en":"Yokohama Arena","lat":35.51,"lng":139.619,"category":"event","priority":1,"nearest_station":"新横浜","nearest_station_lat":35.5083,"nearest_station_lng":139.6161,"city":"yokohama","tags":["concert","arena"]},
  {"name":"日本武道館","name_en":"Nippon Budokan","lat":35.6934,"lng":139.7499,"category":"event","priority":1,"nearest_station":"九段下","nearest_station_lat":35.6953,"nearest_station_lng":139.7497,"city":"tokyo","tags":["concert","arena"]},
  {"name":"国立代々木競技場","name_en":"Yoyogi National Gymnasium","lat":35.6686,"lng":139.6961,"category":"event","priority":2,"nearest_station":"原宿","nearest_station_lat":35.6702,"nearest_station_lng":139.7027,"city":"tokyo","tags":["concert","arena"]},
  {"name":"マリンメッセ福岡","name_en":"Marine Messe Fukuoka","lat":33.5942,"lng":130.4089,"category":"event","priority":2,"nearest_station":"ベイサイドプレイス博多","nearest_station_lat":33.5961,"nearest_station_lng":130.4069,"city":"fukuoka","tags":["concert","arena"]},
  {"name":"大阪城ホール","name_en":"Osaka-jo Hall","lat":34.6866,"lng":135.5277,"category":"event","priority":2,"nearest_station":"大阪城公園","nearest_station_lat":34.6837,"nearest_station_lng":135.5266,"city":"osaka","tags":["concert","arena"]},
  {"name":"ぴあMFTアリーナ仙台","name_en":"Pia MF Theater Arena Sendai","lat":38.26,"lng":140.8994,"category":"event","priority":2,"nearest_station":"宮城野原","nearest_station_lat":38.2617,"nearest_station_lng":140.9017,"city":"sendai","tags":["concert","arena"]},
  {"name":"真駒内セキスイハイムアイスアリーナ","name_en":"Makomanai Sekisui Heim Ice Arena","lat":42.9931,"lng":141.3583,"category":"event","priority":2,"nearest_station":"真駒内","nearest_station_lat":42.9958,"nearest_station_lng":141.3572,"city":"sapporo","tags":["concert","arena","sapporo"]},
  {"name":"エコパアリーナ","name_en":"Ecopa Arena","lat":34.7972,"lng":138.0928,"category":"event","priority":2,"nearest_station":"愛野","nearest_station_lat":34.7997,"nearest_station_lng":138.0886,"city":"shizuoka","tags":["concert","arena"]},
  {"name":"グランメッセ熊本","name_en":"Grand Messe Kumamoto","lat":32.8731,"lng":130.8419,"category":"event","priority":2,"nearest_station":"益城熊本空港","nearest_station_lat":32.8381,"nearest_station_lng":130.8281,"city":"kumamoto","tags":["concert","arena"]},
  {"name":"ベルーナドーム","name_en":"Belluna Dome","lat":35.7769,"lng":139.312,"category":"event","priority":3,"nearest_station":"西武球場前","nearest_station_lat":35.7775,"nearest_station_lng":139.3136,"city":"saitama","tags":["concert","baseball","dome"]},
  {"name":"ZOZOマリンスタジアム","name_en":"ZOZO Marine Stadium","lat":35.6453,"lng":140.0317,"category":"event","priority":3,"nearest_station":"海浜幕張","nearest_station_lat":35.6478,"nearest_station_lng":140.0347,"city":"chiba","tags":["concert","baseball","stadium"]},
  {"name":"ガイシホール（日本ガイシホール）","name_en":"Nippon Gaishi Hall","lat":35.11,"lng":136.9283,"category":"event","priority":3,"nearest_station":"笠寺","nearest_station_lat":35.1092,"nearest_station_lng":136.9275,"city":"nagoya","tags":["concert","arena"]},
  {"name":"広島グリーンアリーナ","name_en":"Hiroshima Green Arena","lat":34.3858,"lng":132.455,"category":"event","priority":3,"nearest_station":"広島","nearest_station_lat":34.3963,"nearest_station_lng":132.4597,"city":"hiroshima","tags":["concert","arena"]},
  {"name":"島根県民会館","name_en":"Shimane Prefectural Citizens Hall","lat":35.4719,"lng":133.0503,"category":"event","priority":3,"nearest_station":"松江","nearest_station_lat":35.4678,"nearest_station_lng":133.0497,"city":"matsue","tags":["concert","hall"]},
  {"name":"沖縄セルラースタジアム那覇","name_en":"Okinawa Cellular Stadium Naha","lat":26.2172,"lng":127.7019,"category":"event","priority":3,"nearest_station":"奥武山公園","nearest_station_lat":26.2133,"nearest_station_lng":127.6994,"city":"naha","tags":["concert","baseball","stadium","okinawa"]},
  {"name":"沖縄コンベンションセンター","name_en":"Okinawa Convention Center","lat":26.3083,"lng":127.7561,"category":"event","priority":3,"nearest_station":"宜野湾市","nearest_station_lat":26.2814,"nearest_station_lng":127.7786,"city":"okinawa","tags":["concert","convention","okinawa"]},
  {"name":"那覇文化芸術劇場なはーと","name_en":"Naha Cultural Arts Theater Nahāto","lat":26.2119,"lng":127.6808,"category":"event","priority":3,"nearest_station":"壺川","nearest_station_lat":26.2119,"nearest_station_lng":127.6831,"city":"naha","tags":["concert","theater","okinawa"]},
  {"name":"東京国際フォーラム","name_en":"Tokyo International Forum","lat":35.6762,"lng":139.7634,"category":"event","priority":3,"nearest_station":"有楽町","nearest_station_lat":35.6753,"nearest_station_lng":139.7628,"city":"tokyo","tags":["concert","hall","tokyo"]},

  /* ─── Airports（空港）（17件） ─── */
  {"name":"羽田空港","name_en":"Haneda Airport","lat":35.5533,"lng":139.7811,"category":"airport","priority":1,"nearest_station":"羽田空港第1・第2ターミナル","nearest_station_lat":35.549,"nearest_station_lng":139.783,"city":"tokyo","tags":["airport","HND","international"]},
  {"name":"成田国際空港","name_en":"Narita International Airport","lat":35.7653,"lng":140.3856,"category":"airport","priority":1,"nearest_station":"成田空港","nearest_station_lat":35.7653,"nearest_station_lng":140.3856,"city":"chiba","tags":["airport","NRT","international"]},
  {"name":"関西国際空港","name_en":"Kansai International Airport","lat":34.4272,"lng":135.2444,"category":"airport","priority":1,"nearest_station":"関西空港","nearest_station_lat":34.436,"nearest_station_lng":135.244,"city":"osaka","tags":["airport","KIX","international"]},
  {"name":"大阪国際空港（伊丹）","name_en":"Osaka International Airport (Itami)","lat":34.7855,"lng":135.4381,"category":"airport","priority":1,"nearest_station":"蛍池","nearest_station_lat":34.7969,"nearest_station_lng":135.4283,"city":"osaka","tags":["airport","ITM","domestic"]},
  {"name":"神戸空港","name_en":"Kobe Airport","lat":34.6328,"lng":135.2236,"category":"airport","priority":2,"nearest_station":"神戸空港","nearest_station_lat":34.6328,"nearest_station_lng":135.2197,"city":"kobe","tags":["airport","UKB","domestic"]},
  {"name":"新千歳空港","name_en":"New Chitose Airport","lat":42.7753,"lng":141.6925,"category":"airport","priority":1,"nearest_station":"新千歳空港","nearest_station_lat":42.787,"nearest_station_lng":141.678,"city":"sapporo","tags":["airport","CTS","domestic"]},
  {"name":"福岡空港","name_en":"Fukuoka Airport","lat":33.5844,"lng":130.4517,"category":"airport","priority":1,"nearest_station":"福岡空港","nearest_station_lat":33.585,"nearest_station_lng":130.446,"city":"fukuoka","tags":["airport","FUK","domestic"]},
  {"name":"那覇空港","name_en":"Naha Airport","lat":26.1958,"lng":127.6458,"category":"airport","priority":1,"nearest_station":"那覇空港","nearest_station_lat":26.206,"nearest_station_lng":127.651,"city":"naha","tags":["airport","OKA","domestic"]},
  {"name":"仙台空港","name_en":"Sendai Airport","lat":38.1397,"lng":140.9169,"category":"airport","priority":2,"nearest_station":"仙台空港","nearest_station_lat":38.1383,"nearest_station_lng":140.9172,"city":"sendai","tags":["airport","SDJ","domestic"]},
  {"name":"広島空港","name_en":"Hiroshima Airport","lat":34.4361,"lng":132.9194,"category":"airport","priority":2,"nearest_station":"白市","nearest_station_lat":34.4211,"nearest_station_lng":132.8619,"city":"hiroshima","tags":["airport","HIJ","domestic"]},
  {"name":"鹿児島空港","name_en":"Kagoshima Airport","lat":31.8033,"lng":130.7194,"category":"airport","priority":2,"nearest_station":"鹿児島空港","nearest_station_lat":31.8033,"nearest_station_lng":130.7186,"city":"kagoshima","tags":["airport","KOJ","domestic"]},
  {"name":"宮古空港","name_en":"Miyako Airport","lat":24.7828,"lng":125.295,"category":"airport","priority":2,"nearest_station":"宮古空港","nearest_station_lat":24.7828,"nearest_station_lng":125.295,"city":"miyako","tags":["airport","MMY","okinawa","island"]},
  {"name":"石垣空港","name_en":"Ishigaki Airport","lat":24.3967,"lng":124.1861,"category":"airport","priority":2,"nearest_station":"石垣空港","nearest_station_lat":24.3967,"nearest_station_lng":124.1861,"city":"ishigaki","tags":["airport","ISG","okinawa","island"]},
  {"name":"長崎空港","name_en":"Nagasaki Airport","lat":32.9169,"lng":129.9139,"category":"airport","priority":2,"nearest_station":"ハウステンボス","nearest_station_lat":33.0933,"nearest_station_lng":129.9253,"city":"nagasaki","tags":["airport","NGS","domestic"]},
  {"name":"熊本空港","name_en":"Kumamoto Airport","lat":32.8372,"lng":130.8558,"category":"airport","priority":3,"nearest_station":"肥後大津","nearest_station_lat":32.8778,"nearest_station_lng":130.8358,"city":"kumamoto","tags":["airport","KMJ","domestic"]},
  {"name":"那覇空港（国際線）","name_en":"Naha Airport International","lat":26.1958,"lng":127.6458,"category":"airport","priority":2,"nearest_station":"那覇空港","nearest_station_lat":26.206,"nearest_station_lng":127.651,"city":"naha","tags":["airport","OKA","international","okinawa"]},
  {"name":"下地島空港","name_en":"Shimoji Island Airport","lat":24.8267,"lng":125.1447,"category":"airport","priority":3,"nearest_station":"平良港","nearest_station_lat":24.8056,"nearest_station_lng":125.2811,"city":"miyako","tags":["airport","SHI","okinawa","island"]},

  /* ─── Railway Hubs（鉄道ハブ）（17件） ─── */
  {"name":"東京駅","name_en":"Tokyo Station","lat":35.6812,"lng":139.7671,"category":"railway","priority":1,"nearest_station":"東京","nearest_station_lat":35.6812,"nearest_station_lng":139.7671,"city":"tokyo","tags":["shinkansen","terminal","tokyo"]},
  {"name":"新大阪駅","name_en":"Shin-Osaka Station","lat":34.7333,"lng":135.5,"category":"railway","priority":1,"nearest_station":"新大阪","nearest_station_lat":34.7333,"nearest_station_lng":135.5,"city":"osaka","tags":["shinkansen","terminal","osaka"]},
  {"name":"博多駅","name_en":"Hakata Station","lat":33.5897,"lng":130.4208,"category":"railway","priority":1,"nearest_station":"博多","nearest_station_lat":33.5897,"nearest_station_lng":130.4208,"city":"fukuoka","tags":["shinkansen","terminal","fukuoka"]},
  {"name":"名古屋駅","name_en":"Nagoya Station","lat":35.1706,"lng":136.8816,"category":"railway","priority":1,"nearest_station":"名古屋","nearest_station_lat":35.1706,"nearest_station_lng":136.8816,"city":"nagoya","tags":["shinkansen","terminal","nagoya"]},
  {"name":"京都駅","name_en":"Kyoto Station","lat":34.9858,"lng":135.7588,"category":"railway","priority":1,"nearest_station":"京都","nearest_station_lat":34.9858,"nearest_station_lng":135.7588,"city":"kyoto","tags":["shinkansen","terminal","kyoto"]},
  {"name":"仙台駅","name_en":"Sendai Station","lat":38.2603,"lng":140.882,"category":"railway","priority":1,"nearest_station":"仙台","nearest_station_lat":38.2603,"nearest_station_lng":140.882,"city":"sendai","tags":["shinkansen","terminal","sendai"]},
  {"name":"札幌駅","name_en":"Sapporo Station","lat":43.0686,"lng":141.3508,"category":"railway","priority":1,"nearest_station":"札幌","nearest_station_lat":43.0686,"nearest_station_lng":141.3508,"city":"sapporo","tags":["terminal","sapporo"]},
  {"name":"新宿駅","name_en":"Shinjuku Station","lat":35.6896,"lng":139.7006,"category":"railway","priority":1,"nearest_station":"新宿","nearest_station_lat":35.6896,"nearest_station_lng":139.7006,"city":"tokyo","tags":["terminal","tokyo","hub"]},
  {"name":"渋谷駅","name_en":"Shibuya Station","lat":35.658,"lng":139.7016,"category":"railway","priority":1,"nearest_station":"渋谷","nearest_station_lat":35.658,"nearest_station_lng":139.7016,"city":"tokyo","tags":["terminal","tokyo","hub"]},
  {"name":"新函館北斗駅","name_en":"Shin-Hakodate-Hokuto Station","lat":41.8661,"lng":140.6511,"category":"railway","priority":2,"nearest_station":"新函館北斗","nearest_station_lat":41.8661,"nearest_station_lng":140.6511,"city":"hakodate","tags":["shinkansen","hokkaido"]},
  {"name":"新青森駅","name_en":"Shin-Aomori Station","lat":40.8294,"lng":140.6931,"category":"railway","priority":2,"nearest_station":"新青森","nearest_station_lat":40.8294,"nearest_station_lng":140.6931,"city":"aomori","tags":["shinkansen","tohoku"]},
  {"name":"新潟駅","name_en":"Niigata Station","lat":37.9122,"lng":139.0594,"category":"railway","priority":2,"nearest_station":"新潟","nearest_station_lat":37.9122,"nearest_station_lng":139.0594,"city":"niigata","tags":["shinkansen","terminal"]},
  {"name":"金沢駅","name_en":"Kanazawa Station","lat":36.5783,"lng":136.6486,"category":"railway","priority":2,"nearest_station":"金沢","nearest_station_lat":36.5783,"nearest_station_lng":136.6486,"city":"kanazawa","tags":["shinkansen","terminal","hokuriku"]},
  {"name":"広島駅","name_en":"Hiroshima Station","lat":34.3963,"lng":132.4597,"category":"railway","priority":2,"nearest_station":"広島","nearest_station_lat":34.3963,"nearest_station_lng":132.4597,"city":"hiroshima","tags":["shinkansen","terminal"]},
  {"name":"小倉駅","name_en":"Kokura Station","lat":33.8697,"lng":130.875,"category":"railway","priority":2,"nearest_station":"小倉","nearest_station_lat":33.8697,"nearest_station_lng":130.875,"city":"kitakyushu","tags":["shinkansen","terminal"]},
  {"name":"鹿児島中央駅","name_en":"Kagoshima-Chuo Station","lat":31.5783,"lng":130.5406,"category":"railway","priority":2,"nearest_station":"鹿児島中央","nearest_station_lat":31.5783,"nearest_station_lng":130.5406,"city":"kagoshima","tags":["shinkansen","terminal"]},
  {"name":"那覇バスターミナル","name_en":"Naha Bus Terminal","lat":26.2153,"lng":127.6811,"category":"railway","priority":2,"nearest_station":"旭橋","nearest_station_lat":26.2153,"nearest_station_lng":127.6831,"city":"naha","tags":["bus","terminal","okinawa"]},

  /* ─── Theme Parks（テーマパーク）（4件） ─── */
  {"name":"ユニバーサル・スタジオ・ジャパン","name_en":"Universal Studios Japan","lat":34.6647,"lng":135.4331,"category":"theme_park","priority":1,"nearest_station":"ユニバーサルシティ","nearest_station_lat":34.6678,"nearest_station_lng":135.4386,"city":"osaka","tags":["theme_park","USJ"]},
  {"name":"東京ディズニーランド","name_en":"Tokyo Disneyland","lat":35.6328,"lng":139.8806,"category":"theme_park","priority":1,"nearest_station":"舞浜","nearest_station_lat":35.6359,"nearest_station_lng":139.8784,"city":"chiba","tags":["theme_park","disney"]},
  {"name":"東京ディズニーシー","name_en":"Tokyo DisneySea","lat":35.6267,"lng":139.885,"category":"theme_park","priority":1,"nearest_station":"舞浜","nearest_station_lat":35.6359,"nearest_station_lng":139.8784,"city":"chiba","tags":["theme_park","disney"]},
  {"name":"ハウステンボス","name_en":"Huis Ten Bosch","lat":33.0939,"lng":129.9267,"category":"theme_park","priority":2,"nearest_station":"ハウステンボス","nearest_station_lat":33.0933,"nearest_station_lng":129.9253,"city":"nagasaki","tags":["theme_park","nagasaki"]},

  /* ─── Tourism（観光）（11件） ─── */
  {"name":"沖縄美ら海水族館","name_en":"Okinawa Churaumi Aquarium","lat":26.6938,"lng":127.8783,"category":"tourism","priority":1,"nearest_station":"記念公園前","nearest_station_lat":26.6944,"nearest_station_lng":127.8756,"city":"naha","tags":["aquarium","sightseeing","okinawa"]},
  {"name":"古宇利島","name_en":"Kouri Island","lat":26.6972,"lng":128.0361,"category":"tourism","priority":2,"nearest_station":"名護バスターミナル","nearest_station_lat":26.5919,"nearest_station_lng":127.9775,"city":"nago","tags":["island","sightseeing","okinawa"]},
  {"name":"万座毛","name_en":"Manzamo","lat":26.4444,"lng":127.7264,"category":"tourism","priority":2,"nearest_station":"恩納村","nearest_station_lat":26.4436,"nearest_station_lng":127.7236,"city":"okinawa","tags":["sightseeing","nature","okinawa"]},
  {"name":"新宿御苑","name_en":"Shinjuku Gyoen","lat":35.6852,"lng":139.71,"category":"tourism","priority":2,"nearest_station":"新宿御苑前","nearest_station_lat":35.6875,"nearest_station_lng":139.7083,"city":"tokyo","tags":["park","sightseeing","tokyo"]},
  {"name":"上野公園・東京国立博物館","name_en":"Ueno Park / Tokyo National Museum","lat":35.7189,"lng":139.775,"category":"tourism","priority":2,"nearest_station":"上野","nearest_station_lat":35.7141,"nearest_station_lng":139.7774,"city":"tokyo","tags":["park","museum","sightseeing","tokyo"]},
  {"name":"箱根（芦ノ湖・大涌谷）","name_en":"Hakone","lat":35.2328,"lng":139.1069,"category":"tourism","priority":2,"nearest_station":"箱根湯本","nearest_station_lat":35.2481,"nearest_station_lng":139.1044,"city":"kanagawa","tags":["onsen","sightseeing","nature"]},
  {"name":"志賀高原・草津温泉","name_en":"Kusatsu Onsen","lat":36.6194,"lng":138.5958,"category":"tourism","priority":3,"nearest_station":"長野原草津口","nearest_station_lat":36.6003,"nearest_station_lng":138.6433,"city":"gunma","tags":["onsen","sightseeing","nature"]},
  {"name":"別府温泉","name_en":"Beppu Onsen","lat":33.2839,"lng":131.4914,"category":"tourism","priority":3,"nearest_station":"別府","nearest_station_lat":33.2839,"nearest_station_lng":131.4914,"city":"beppu","tags":["onsen","sightseeing","oita"]},
  {"name":"道後温泉","name_en":"Dogo Onsen","lat":33.8519,"lng":132.7869,"category":"tourism","priority":3,"nearest_station":"道後温泉","nearest_station_lat":33.8519,"nearest_station_lng":132.7858,"city":"matsuyama","tags":["onsen","sightseeing","ehime"]},
  {"name":"登別温泉","name_en":"Noboribetsu Onsen","lat":42.4619,"lng":141.1061,"category":"tourism","priority":3,"nearest_station":"登別","nearest_station_lat":42.4094,"nearest_station_lng":141.1069,"city":"noboribetsu","tags":["onsen","sightseeing","hokkaido"]},
  {"name":"屋久島","name_en":"Yakushima","lat":30.3639,"lng":130.6572,"category":"tourism","priority":3,"nearest_station":"宮之浦港","nearest_station_lat":30.4003,"nearest_station_lng":130.6522,"city":"yakushima","tags":["world_heritage","nature","island"]},

  /* ─── Landmarks（ランドマーク）（21件） ─── */
  {"name":"清水寺","name_en":"Kiyomizu-dera","lat":34.995,"lng":135.785,"category":"landmark","priority":1,"nearest_station":"清水五条","nearest_station_lat":34.9961,"nearest_station_lng":135.7685,"city":"kyoto","tags":["temple","world_heritage","sightseeing"]},
  {"name":"出雲大社","name_en":"Izumo Taisha","lat":35.4019,"lng":132.6856,"category":"landmark","priority":1,"nearest_station":"出雲大社前","nearest_station_lat":35.3936,"nearest_station_lng":132.6871,"city":"izumo","tags":["shrine","sightseeing"]},
  {"name":"浅草寺","name_en":"Senso-ji Temple","lat":35.7148,"lng":139.7967,"category":"landmark","priority":1,"nearest_station":"浅草","nearest_station_lat":35.711,"nearest_station_lng":139.7965,"city":"tokyo","tags":["temple","sightseeing","tokyo"]},
  {"name":"伏見稲荷大社","name_en":"Fushimi Inari Taisha","lat":34.9671,"lng":135.7727,"category":"landmark","priority":1,"nearest_station":"稲荷","nearest_station_lat":34.9671,"nearest_station_lng":135.7692,"city":"kyoto","tags":["shrine","sightseeing","kyoto"]},
  {"name":"厳島神社","name_en":"Itsukushima Shrine","lat":34.2955,"lng":132.3197,"category":"landmark","priority":1,"nearest_station":"宮島口","nearest_station_lat":34.3506,"nearest_station_lng":132.3178,"city":"hiroshima","tags":["shrine","world_heritage","sightseeing"]},
  {"name":"原爆ドーム","name_en":"Atomic Bomb Dome","lat":34.3955,"lng":132.4536,"category":"landmark","priority":1,"nearest_station":"原爆ドーム前","nearest_station_lat":34.3944,"nearest_station_lng":132.4531,"city":"hiroshima","tags":["world_heritage","sightseeing","history"]},
  {"name":"金閣寺","name_en":"Kinkaku-ji","lat":35.0394,"lng":135.7292,"category":"landmark","priority":1,"nearest_station":"金閣寺道","nearest_station_lat":35.0394,"nearest_station_lng":135.7244,"city":"kyoto","tags":["temple","world_heritage","sightseeing"]},
  {"name":"奈良公園・東大寺","name_en":"Nara Park / Todai-ji","lat":34.6889,"lng":135.8397,"category":"landmark","priority":1,"nearest_station":"近鉄奈良","nearest_station_lat":34.6831,"nearest_station_lng":135.8306,"city":"nara","tags":["temple","world_heritage","sightseeing","deer"]},
  {"name":"姫路城","name_en":"Himeji Castle","lat":34.8394,"lng":134.6939,"category":"landmark","priority":1,"nearest_station":"姫路","nearest_station_lat":34.8261,"nearest_station_lng":134.6936,"city":"himeji","tags":["castle","world_heritage","sightseeing"]},
  {"name":"札幌時計台","name_en":"Sapporo Clock Tower","lat":43.0631,"lng":141.3536,"category":"landmark","priority":2,"nearest_station":"大通","nearest_station_lat":43.0556,"nearest_station_lng":141.3519,"city":"sapporo","tags":["sightseeing","sapporo"]},
  {"name":"函館山","name_en":"Mt. Hakodate","lat":41.7622,"lng":140.6986,"category":"landmark","priority":2,"nearest_station":"十字街","nearest_station_lat":41.7706,"nearest_station_lng":140.7133,"city":"hakodate","tags":["sightseeing","nightview","hokkaido"]},
  {"name":"道頓堀","name_en":"Dotonbori","lat":34.6686,"lng":135.5014,"category":"landmark","priority":1,"nearest_station":"なんば","nearest_station_lat":34.6658,"nearest_station_lng":135.5011,"city":"osaka","tags":["sightseeing","food","osaka"]},
  {"name":"国際通り","name_en":"Kokusai-dori","lat":26.2169,"lng":127.6878,"category":"landmark","priority":1,"nearest_station":"牧志","nearest_station_lat":26.2183,"nearest_station_lng":127.6922,"city":"naha","tags":["sightseeing","shopping","okinawa","food"]},
  {"name":"首里城","name_en":"Shuri Castle","lat":26.2172,"lng":127.7194,"category":"landmark","priority":1,"nearest_station":"首里","nearest_station_lat":26.2153,"nearest_station_lng":127.7147,"city":"naha","tags":["castle","world_heritage","sightseeing","okinawa"]},
  {"name":"東京スカイツリー","name_en":"Tokyo Skytree","lat":35.7101,"lng":139.8107,"category":"landmark","priority":1,"nearest_station":"とうきょうスカイツリー","nearest_station_lat":35.7097,"nearest_station_lng":139.8083,"city":"tokyo","tags":["sightseeing","tokyo"]},
  {"name":"渋谷スクランブル交差点","name_en":"Shibuya Scramble Crossing","lat":35.6595,"lng":139.7004,"category":"landmark","priority":1,"nearest_station":"渋谷","nearest_station_lat":35.658,"nearest_station_lng":139.7016,"city":"tokyo","tags":["sightseeing","tokyo"]},
  {"name":"富士山（河口湖）","name_en":"Mt. Fuji (Kawaguchiko)","lat":35.4722,"lng":138.8319,"category":"landmark","priority":1,"nearest_station":"河口湖","nearest_station_lat":35.4994,"nearest_station_lng":138.7564,"city":"yamanashi","tags":["mountain","world_heritage","sightseeing"]},
  {"name":"日光東照宮","name_en":"Nikko Tosho-gu","lat":36.7581,"lng":139.5989,"category":"landmark","priority":2,"nearest_station":"東武日光","nearest_station_lat":36.75,"nearest_station_lng":139.6036,"city":"nikko","tags":["shrine","world_heritage","sightseeing"]},
  {"name":"道頓堀（グリコサイン）","name_en":"Dotonbori Glico Sign","lat":34.6686,"lng":135.5014,"category":"landmark","priority":2,"nearest_station":"なんば","nearest_station_lat":34.6658,"nearest_station_lng":135.5011,"city":"osaka","tags":["sightseeing","food","osaka","iconic"]},
  {"name":"白川郷","name_en":"Shirakawa-go","lat":36.2572,"lng":136.906,"category":"landmark","priority":2,"nearest_station":"白川郷","nearest_station_lat":36.2572,"nearest_station_lng":136.9047,"city":"gifu","tags":["world_heritage","sightseeing","snow"]},
  {"name":"宮島・厳島神社（フェリー乗り場）","name_en":"Miyajima Ferry Terminal","lat":34.3506,"lng":132.3178,"category":"landmark","priority":2,"nearest_station":"宮島口","nearest_station_lat":34.3506,"nearest_station_lng":132.3178,"city":"hiroshima","tags":["ferry","world_heritage","sightseeing"]}

];
