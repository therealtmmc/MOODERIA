export interface Province {
  name: string;
  capital: string;
  population: number;
}

export interface CountryDetails {
  provinces: Province[];
  currencyRate: number; // 1 USD = X Local Currency
}

export const COUNTRY_DETAILS: Record<string, CountryDetails> = {
  "United States": {
    currencyRate: 1,
    provinces: [
      { name: "California", capital: "Sacramento", population: 39538223 },
      { name: "Texas", capital: "Austin", population: 29145505 },
      { name: "Florida", capital: "Tallahassee", population: 21538187 },
      { name: "New York", capital: "Albany", population: 20201249 },
      { name: "Pennsylvania", capital: "Harrisburg", population: 13002700 },
      { name: "Illinois", capital: "Springfield", population: 12812508 },
      { name: "Ohio", capital: "Columbus", population: 11799448 },
      { name: "Georgia", capital: "Atlanta", population: 10711908 },
      { name: "North Carolina", capital: "Raleigh", population: 10439388 },
      { name: "Michigan", capital: "Lansing", population: 10077331 }
    ]
  },
  "China": {
    currencyRate: 7.19,
    provinces: [
      { name: "Guangdong", capital: "Guangzhou", population: 126012510 },
      { name: "Shandong", capital: "Jinan", population: 101527453 },
      { name: "Henan", capital: "Zhengzhou", population: 99365519 },
      { name: "Sichuan", capital: "Chengdu", population: 83674866 },
      { name: "Jiangsu", capital: "Nanjing", population: 84748016 },
      { name: "Hebei", capital: "Shijiazhuang", population: 74610235 },
      { name: "Hunan", capital: "Changsha", population: 66444864 },
      { name: "Anhui", capital: "Hefei", population: 61027171 },
      { name: "Hubei", capital: "Wuhan", population: 57752557 },
      { name: "Zhejiang", capital: "Hangzhou", population: 64567588 }
    ]
  },
  "India": {
    currencyRate: 82.9,
    provinces: [
      { name: "Uttar Pradesh", capital: "Lucknow", population: 199812341 },
      { name: "Maharashtra", capital: "Mumbai", population: 112374333 },
      { name: "Bihar", capital: "Patna", population: 104099452 },
      { name: "West Bengal", capital: "Kolkata", population: 91276115 },
      { name: "Madhya Pradesh", capital: "Bhopal", population: 72626809 },
      { name: "Tamil Nadu", capital: "Chennai", population: 72147030 },
      { name: "Rajasthan", capital: "Jaipur", population: 68548437 },
      { name: "Karnataka", capital: "Bengaluru", population: 61095297 },
      { name: "Gujarat", capital: "Gandhinagar", population: 60439692 },
      { name: "Andhra Pradesh", capital: "Amaravati", population: 49577103 }
    ]
  },
  "Japan": {
    currencyRate: 150.2,
    provinces: [
      { name: "Tokyo", capital: "Tokyo", population: 13960236 },
      { name: "Kanagawa", capital: "Yokohama", population: 9216009 },
      { name: "Osaka", capital: "Osaka", population: 8823453 },
      { name: "Aichi", capital: "Nagoya", population: 7552873 },
      { name: "Saitama", capital: "Saitama", population: 7330000 },
      { name: "Chiba", capital: "Chiba", population: 6275000 },
      { name: "Hyogo", capital: "Kobe", population: 5466000 },
      { name: "Hokkaido", capital: "Sapporo", population: 5250000 },
      { name: "Fukuoka", capital: "Fukuoka", population: 5104000 },
      { name: "Shizuoka", capital: "Shizuoka", population: 3659000 }
    ]
  },
  "Germany": {
    currencyRate: 0.92,
    provinces: [
      { name: "North Rhine-Westphalia", capital: "Düsseldorf", population: 17925570 },
      { name: "Bavaria", capital: "Munich", population: 13140183 },
      { name: "Baden-Württemberg", capital: "Stuttgart", population: 11103043 },
      { name: "Lower Saxony", capital: "Hanover", population: 8003421 },
      { name: "Hesse", capital: "Wiesbaden", population: 6293154 },
      { name: "Saxony", capital: "Dresden", population: 4056941 },
      { name: "Rhineland-Palatinate", capital: "Mainz", population: 4098391 },
      { name: "Berlin", capital: "Berlin", population: 3664088 },
      { name: "Schleswig-Holstein", capital: "Kiel", population: 2910875 },
      { name: "Brandenburg", capital: "Potsdam", population: 2531071 }
    ]
  },
  "United Kingdom": {
    currencyRate: 0.79,
    provinces: [
      { name: "England", capital: "London", population: 56286961 },
      { name: "Scotland", capital: "Edinburgh", population: 5463300 },
      { name: "Wales", capital: "Cardiff", population: 3152879 },
      { name: "Northern Ireland", capital: "Belfast", population: 1893667 }
    ]
  },
  "France": {
    currencyRate: 0.92,
    provinces: [
      { name: "Île-de-France", capital: "Paris", population: 12213447 },
      { name: "Auvergne-Rhône-Alpes", capital: "Lyon", population: 8026685 },
      { name: "Hauts-de-France", capital: "Lille", population: 6009976 },
      { name: "Nouvelle-Aquitaine", capital: "Bordeaux", population: 5987014 },
      { name: "Occitanie", capital: "Toulouse", population: 5933185 },
      { name: "Grand Est", capital: "Strasbourg", population: 5550389 },
      { name: "Provence-Alpes-Côte d'Azur", capital: "Marseille", population: 5081101 },
      { name: "Pays de la Loire", capital: "Nantes", population: 3806461 },
      { name: "Normandy", capital: "Rouen", population: 3327966 },
      { name: "Brittany", capital: "Rennes", population: 3329395 }
    ]
  },
  "Brazil": {
    currencyRate: 4.95,
    provinces: [
      { name: "São Paulo", capital: "São Paulo", population: 46289333 },
      { name: "Minas Gerais", capital: "Belo Horizonte", population: 21292666 },
      { name: "Rio de Janeiro", capital: "Rio de Janeiro", population: 17366189 },
      { name: "Bahia", capital: "Salvador", population: 14930634 },
      { name: "Paraná", capital: "Curitiba", population: 11516840 },
      { name: "Rio Grande do Sul", capital: "Porto Alegre", population: 11422973 },
      { name: "Pernambuco", capital: "Recife", population: 9616621 },
      { name: "Ceará", capital: "Fortaleza", population: 9187103 },
      { name: "Pará", capital: "Belém", population: 8690745 },
      { name: "Santa Catarina", capital: "Florianópolis", population: 7252502 }
    ]
  },
  "Russia": {
    currencyRate: 92.5,
    provinces: [
      { name: "Moscow", capital: "Moscow", population: 12655050 },
      { name: "Moscow Oblast", capital: "Moscow", population: 7708499 },
      { name: "Krasnodar Krai", capital: "Krasnodar", population: 5675462 },
      { name: "Saint Petersburg", capital: "Saint Petersburg", population: 5384342 },
      { name: "Sverdlovsk Oblast", capital: "Yekaterinburg", population: 4310681 },
      { name: "Rostov Oblast", capital: "Rostov-on-Don", population: 4181486 },
      { name: "Bashkortostan", capital: "Ufa", population: 4091423 },
      { name: "Tatarstan", capital: "Kazan", population: 4004809 },
      { name: "Chelyabinsk Oblast", capital: "Chelyabinsk", population: 3442810 },
      { name: "Nizhny Novgorod Oblast", capital: "Nizhny Novgorod", population: 3176552 }
    ]
  },
  "Canada": {
    currencyRate: 1.36,
    provinces: [
      { name: "Ontario", capital: "Toronto", population: 14734014 },
      { name: "Quebec", capital: "Quebec City", population: 8574571 },
      { name: "British Columbia", capital: "Victoria", population: 5147712 },
      { name: "Alberta", capital: "Edmonton", population: 4421876 },
      { name: "Manitoba", capital: "Winnipeg", population: 1379263 },
      { name: "Saskatchewan", capital: "Regina", population: 1178681 },
      { name: "Nova Scotia", capital: "Halifax", population: 979351 },
      { name: "New Brunswick", capital: "Fredericton", population: 781476 },
      { name: "Newfoundland and Labrador", capital: "St. John's", population: 522103 },
      { name: "Prince Edward Island", capital: "Charlottetown", population: 159625 }
    ]
  },
  "Australia": {
    currencyRate: 1.53,
    provinces: [
      { name: "New South Wales", capital: "Sydney", population: 8166369 },
      { name: "Victoria", capital: "Melbourne", population: 6680648 },
      { name: "Queensland", capital: "Brisbane", population: 5174400 },
      { name: "Western Australia", capital: "Perth", population: 2667130 },
      { name: "South Australia", capital: "Adelaide", population: 1770591 },
      { name: "Tasmania", capital: "Hobart", population: 541071 },
      { name: "Australian Capital Territory", capital: "Canberra", population: 431215 },
      { name: "Northern Territory", capital: "Darwin", population: 246500 }
    ]
  },
  "Italy": {
    currencyRate: 0.92,
    provinces: [
      { name: "Lombardy", capital: "Milan", population: 10060574 },
      { name: "Lazio", capital: "Rome", population: 5879082 },
      { name: "Campania", capital: "Naples", population: 5801692 },
      { name: "Veneto", capital: "Venice", population: 4905854 },
      { name: "Sicily", capital: "Palermo", population: 4875290 },
      { name: "Emilia-Romagna", capital: "Bologna", population: 4459477 },
      { name: "Piedmont", capital: "Turin", population: 4356406 },
      { name: "Apulia", capital: "Bari", population: 4029053 },
      { name: "Tuscany", capital: "Florence", population: 3729641 },
      { name: "Calabria", capital: "Catanzaro", population: 1947131 }
    ]
  },
  "Spain": {
    currencyRate: 0.92,
    provinces: [
      { name: "Andalusia", capital: "Seville", population: 8476718 },
      { name: "Catalonia", capital: "Barcelona", population: 7780479 },
      { name: "Madrid", capital: "Madrid", population: 6779888 },
      { name: "Valencian Community", capital: "Valencia", population: 5057353 },
      { name: "Galicia", capital: "Santiago de Compostela", population: 2701819 },
      { name: "Castile and León", capital: "Valladolid", population: 2394918 },
      { name: "Basque Country", capital: "Vitoria-Gasteiz", population: 2220504 },
      { name: "Canary Islands", capital: "Las Palmas/Santa Cruz", population: 2175952 },
      { name: "Castile-La Mancha", capital: "Toledo", population: 2045221 },
      { name: "Murcia", capital: "Murcia", population: 1511251 }
    ]
  },
  "South Korea": {
    currencyRate: 1330,
    provinces: [
      { name: "Gyeonggi", capital: "Suwon", population: 13427014 },
      { name: "Seoul", capital: "Seoul", population: 9720846 },
      { name: "Busan", capital: "Busan", population: 3404423 },
      { name: "South Gyeongsang", capital: "Changwon", population: 3340216 },
      { name: "Incheon", capital: "Incheon", population: 2947217 },
      { name: "North Gyeongsang", capital: "Andong", population: 2665836 },
      { name: "Daegu", capital: "Daegu", population: 2418346 },
      { name: "South Chungcheong", capital: "Hongseong", population: 2123775 },
      { name: "South Jeolla", capital: "Muan", population: 1851549 },
      { name: "North Jeolla", capital: "Jeonju", population: 1804104 }
    ]
  },
  "Indonesia": {
    currencyRate: 15600,
    provinces: [
      { name: "West Java", capital: "Bandung", population: 48274162 },
      { name: "East Java", capital: "Surabaya", population: 40665696 },
      { name: "Central Java", capital: "Semarang", population: 36516035 },
      { name: "North Sumatra", capital: "Medan", population: 14799361 },
      { name: "Banten", capital: "Serang", population: 11904562 },
      { name: "Jakarta", capital: "Jakarta", population: 10562088 },
      { name: "South Sulawesi", capital: "Makassar", population: 9073509 },
      { name: "Lampung", capital: "Bandar Lampung", population: 9007848 },
      { name: "South Sumatra", capital: "Palembang", population: 8467432 },
      { name: "Riau", capital: "Pekanbaru", population: 6394087 }
    ]
  },
  "Mexico": {
    currencyRate: 17.1,
    provinces: [
      { name: "State of Mexico", capital: "Toluca", population: 16992418 },
      { name: "Mexico City", capital: "Mexico City", population: 9209944 },
      { name: "Jalisco", capital: "Guadalajara", population: 8348151 },
      { name: "Veracruz", capital: "Xalapa", population: 8062579 },
      { name: "Puebla", capital: "Puebla", population: 6583278 },
      { name: "Guanajuato", capital: "Guanajuato", population: 6166934 },
      { name: "Chiapas", capital: "Tuxtla Gutiérrez", population: 5543828 },
      { name: "Nuevo León", capital: "Monterrey", population: 5784442 },
      { name: "Michoacán", capital: "Morelia", population: 4748846 },
      { name: "Oaxaca", capital: "Oaxaca", population: 4132148 }
    ]
  },
  "South Africa": {
    currencyRate: 19.1,
    provinces: [
      { name: "Gauteng", capital: "Johannesburg", population: 15488137 },
      { name: "KwaZulu-Natal", capital: "Pietermaritzburg", population: 11531628 },
      { name: "Western Cape", capital: "Cape Town", population: 7005741 },
      { name: "Eastern Cape", capital: "Bhisho", population: 6734001 },
      { name: "Limpopo", capital: "Polokwane", population: 5852553 },
      { name: "Mpumalanga", capital: "Mbombela", population: 4679786 },
      { name: "North West", capital: "Mahikeng", population: 4108816 },
      { name: "Free State", capital: "Bloemfontein", population: 2928575 },
      { name: "Northern Cape", capital: "Kimberley", population: 1292786 }
    ]
  },
  "Nigeria": {
    currencyRate: 1500, // Highly volatile, approximate
    provinces: [
      { name: "Kano", capital: "Kano", population: 14253549 },
      { name: "Lagos", capital: "Ikeja", population: 12772884 },
      { name: "Katsina", capital: "Katsina", population: 9300382 },
      { name: "Kaduna", capital: "Kaduna", population: 8324285 },
      { name: "Bauchi", capital: "Bauchi", population: 7540663 },
      { name: "Oyo", capital: "Ibadan", population: 7512855 },
      { name: "Rivers", capital: "Port Harcourt", population: 7034973 },
      { name: "Jigawa", capital: "Dutse", population: 6779080 },
      { name: "Niger", capital: "Minna", population: 6220617 },
      { name: "Ogun", capital: "Abeokuta", population: 5933202 }
    ]
  },
  "Argentina": {
    currencyRate: 850, // Volatile
    provinces: [
      { name: "Buenos Aires", capital: "La Plata", population: 17569053 },
      { name: "Córdoba", capital: "Córdoba", population: 3978984 },
      { name: "Santa Fe", capital: "Santa Fe", population: 3556522 },
      { name: "City of Buenos Aires", capital: "Buenos Aires", population: 3120612 },
      { name: "Mendoza", capital: "Mendoza", population: 2014533 },
      { name: "Tucumán", capital: "San Miguel de Tucumán", population: 1703186 },
      { name: "Salta", capital: "Salta", population: 1440672 },
      { name: "Entre Ríos", capital: "Paraná", population: 1426426 },
      { name: "Misiones", capital: "Posadas", population: 1280960 },
      { name: "Corrientes", capital: "Corrientes", population: 1197553 }
    ]
  },
  "Turkey": {
    currencyRate: 31.0,
    provinces: [
      { name: "Istanbul", capital: "Istanbul", population: 15840900 },
      { name: "Ankara", capital: "Ankara", population: 5747325 },
      { name: "Izmir", capital: "Izmir", population: 4425789 },
      { name: "Bursa", capital: "Bursa", population: 3147818 },
      { name: "Antalya", capital: "Antalya", population: 2619832 },
      { name: "Konya", capital: "Konya", population: 2277017 },
      { name: "Adana", capital: "Adana", population: 2263373 },
      { name: "Sanliurfa", capital: "Sanliurfa", population: 2143020 },
      { name: "Gaziantep", capital: "Gaziantep", population: 2130432 },
      { name: "Kocaeli", capital: "Izmit", population: 2033441 }
    ]
  },
  "Philippines": {
    currencyRate: 56.0,
    provinces: [
      { name: "Metro Manila", capital: "Manila", population: 13484462 },
      { name: "Calabarzon", capital: "Calamba", population: 16195042 },
      { name: "Central Luzon", capital: "San Fernando", population: 12422172 },
      { name: "Central Visayas", capital: "Cebu City", population: 8081988 },
      { name: "Western Visayas", capital: "Iloilo City", population: 7954723 },
      { name: "Davao Region", capital: "Davao City", population: 5243536 },
      { name: "Northern Mindanao", capital: "Cagayan de Oro", population: 5022768 },
      { name: "Ilocos Region", capital: "San Fernando", population: 5301139 },
      { name: "Bicol Region", capital: "Legazpi", population: 6082165 },
      { name: "Soccsksargen", capital: "Koronadal", population: 4901486 }
    ]
  },
  "Vietnam": {
    currencyRate: 24500,
    provinces: [
      { name: "Ho Chi Minh City", capital: "Ho Chi Minh City", population: 9389720 },
      { name: "Hanoi", capital: "Hanoi", population: 8435700 },
      { name: "Thanh Hoa", capital: "Thanh Hoa", population: 3712400 },
      { name: "Nghe An", capital: "Vinh", population: 3409800 },
      { name: "Dong Nai", capital: "Bien Hoa", population: 3255800 },
      { name: "Binh Duong", capital: "Thu Dau Mot", population: 2678200 },
      { name: "Hai Phong", capital: "Hai Phong", population: 2072400 },
      { name: "Dak Lak", capital: "Buon Ma Thuot", population: 1918400 },
      { name: "Soc Trang", capital: "Soc Trang", population: 1199653 },
      { name: "An Giang", capital: "Long Xuyen", population: 1908352 }
    ]
  },
  "Thailand": {
    currencyRate: 35.8,
    provinces: [
      { name: "Bangkok", capital: "Bangkok", population: 5588222 },
      { name: "Nakhon Ratchasima", capital: "Nakhon Ratchasima", population: 2633207 },
      { name: "Ubon Ratchathani", capital: "Ubon Ratchathani", population: 1866697 },
      { name: "Khon Kaen", capital: "Khon Kaen", population: 1794583 },
      { name: "Chiang Mai", capital: "Chiang Mai", population: 1779254 },
      { name: "Buriram", capital: "Buriram", population: 1579248 },
      { name: "Udon Thani", capital: "Udon Thani", population: 1563964 },
      { name: "Nakhon Si Thammarat", capital: "Nakhon Si Thammarat", population: 1544957 },
      { name: "Sisaket", capital: "Sisaket", population: 1465213 },
      { name: "Chonburi", capital: "Chonburi", population: 1558301 }
    ]
  },
  "Malaysia": {
    currencyRate: 4.77,
    provinces: [
      { name: "Selangor", capital: "Shah Alam", population: 6994423 },
      { name: "Johor", capital: "Johor Bahru", population: 4009670 },
      { name: "Sabah", capital: "Kota Kinabalu", population: 3418785 },
      { name: "Perak", capital: "Ipoh", population: 2496041 },
      { name: "Sarawak", capital: "Kuching", population: 2453677 },
      { name: "Kedah", capital: "Alor Setar", population: 2131427 },
      { name: "Kuala Lumpur", capital: "Kuala Lumpur", population: 1982112 },
      { name: "Penang", capital: "George Town", population: 1740405 },
      { name: "Kelantan", capital: "Kota Bharu", population: 1792501 },
      { name: "Pahang", capital: "Kuantan", population: 1591295 }
    ]
  },
  "Singapore": {
    currencyRate: 1.34,
    provinces: [
      { name: "Central Region", capital: "Singapore", population: 922987 },
      { name: "West Region", capital: "Singapore", population: 922544 },
      { name: "North-East Region", capital: "Singapore", population: 930910 },
      { name: "East Region", capital: "Singapore", population: 685893 },
      { name: "North Region", capital: "Singapore", population: 582336 }
    ]
  },
  "Pakistan": {
    currencyRate: 278.5,
    provinces: [
      { name: "Punjab", capital: "Lahore", population: 127688922 },
      { name: "Sindh", capital: "Karachi", population: 55696147 },
      { name: "Khyber Pakhtunkhwa", capital: "Peshawar", population: 40856097 },
      { name: "Balochistan", capital: "Quetta", population: 14894402 },
      { name: "Islamabad Capital Territory", capital: "Islamabad", population: 2363863 },
      { name: "Azad Kashmir", capital: "Muzaffarabad", population: 4045366 },
      { name: "Gilgit-Baltistan", capital: "Gilgit", population: 1492924 }
    ]
  },
  "Bangladesh": {
    currencyRate: 109.5,
    provinces: [
      { name: "Dhaka", capital: "Dhaka", population: 44215107 },
      { name: "Chittagong", capital: "Chittagong", population: 33202326 },
      { name: "Rajshahi", capital: "Rajshahi", population: 20353119 },
      { name: "Rangpur", capital: "Rangpur", population: 17610956 },
      { name: "Khulna", capital: "Khulna", population: 17416645 },
      { name: "Mymensingh", capital: "Mymensingh", population: 12225498 },
      { name: "Sylhet", capital: "Sylhet", population: 11034863 },
      { name: "Barisal", capital: "Barisal", population: 9100102 }
    ]
  },
  "Egypt": {
    currencyRate: 30.9,
    provinces: [
      { name: "Cairo", capital: "Cairo", population: 10200000 },
      { name: "Giza", capital: "Giza", population: 9300000 },
      { name: "Sharqia", capital: "Zagazig", population: 7800000 },
      { name: "Dakahlia", capital: "Mansoura", population: 7000000 },
      { name: "Beheira", capital: "Damanhur", population: 6800000 },
      { name: "Minya", capital: "Minya", population: 6200000 },
      { name: "Qalyubia", capital: "Banha", population: 6000000 },
      { name: "Sohag", capital: "Sohag", population: 5600000 },
      { name: "Alexandria", capital: "Alexandria", population: 5500000 },
      { name: "Gharbia", capital: "Tanta", population: 5300000 }
    ]
  },
  "Saudi Arabia": {
    currencyRate: 3.75,
    provinces: [
      { name: "Riyadh", capital: "Riyadh", population: 8591748 },
      { name: "Makkah", capital: "Mecca", population: 8557766 },
      { name: "Eastern Province", capital: "Dammam", population: 4900325 },
      { name: "Madinah", capital: "Medina", population: 2132679 },
      { name: "Asir", capital: "Abha", population: 2211875 },
      { name: "Jizan", capital: "Jizan", population: 1603659 },
      { name: "Qassim", capital: "Buraidah", population: 1423935 },
      { name: "Tabuk", capital: "Tabuk", population: 910030 },
      { name: "Hail", capital: "Hail", population: 699774 },
      { name: "Najran", capital: "Najran", population: 592300 }
    ]
  },
  "Colombia": {
    currencyRate: 3900,
    provinces: [
      { name: "Bogotá", capital: "Bogotá", population: 7743955 },
      { name: "Antioquia", capital: "Medellín", population: 6677930 },
      { name: "Valle del Cauca", capital: "Cali", population: 4532152 },
      { name: "Cundinamarca", capital: "Bogotá", population: 3242999 },
      { name: "Atlántico", capital: "Barranquilla", population: 2722128 },
      { name: "Santander", capital: "Bucaramanga", population: 2280908 },
      { name: "Bolívar", capital: "Cartagena", population: 2180976 },
      { name: "Córdoba", capital: "Montería", population: 1828947 },
      { name: "Nariño", capital: "Pasto", population: 1627589 },
      { name: "Norte de Santander", capital: "Cúcuta", population: 1620318 }
    ]
  }
};
