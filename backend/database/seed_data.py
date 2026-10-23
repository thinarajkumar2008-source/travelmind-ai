"""
Comprehensive Seed Data for 115+ Global Countries, Regions, and Settlements.
Sources: GeoNames (CC BY 4.0), OpenStreetMap (ODbL), and REST Countries.
"""

COUNTRIES_SEED = [
    # ASIA
    {
        "id": "IN", "name": "India", "iso2": "IN", "iso3": "IND", "capital": "New Delhi",
        "continent": "Asia", "region": "Southern Asia", "currency_code": "INR",
        "languages": "Hindi, English", "flag_emoji": "🇮🇳", "latitude": 20.5937, "longitude": 78.9629
    },
    {
        "id": "JP", "name": "Japan", "iso2": "JP", "iso3": "JPN", "capital": "Tokyo",
        "continent": "Asia", "region": "Eastern Asia", "currency_code": "JPY",
        "languages": "Japanese", "flag_emoji": "🇯🇵", "latitude": 36.2048, "longitude": 138.2529
    },
    {
        "id": "CN", "name": "China", "iso2": "CN", "iso3": "CHN", "capital": "Beijing",
        "continent": "Asia", "region": "Eastern Asia", "currency_code": "CNY",
        "languages": "Mandarin Chinese", "flag_emoji": "🇨🇳", "latitude": 35.8617, "longitude": 104.1954
    },
    {
        "id": "ID", "name": "Indonesia", "iso2": "ID", "iso3": "IDN", "capital": "Jakarta",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "IDR",
        "languages": "Indonesian", "flag_emoji": "🇮🇩", "latitude": -0.7893, "longitude": 113.9213
    },
    {
        "id": "TH", "name": "Thailand", "iso2": "TH", "iso3": "THA", "capital": "Bangkok",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "THB",
        "languages": "Thai", "flag_emoji": "🇹🇭", "latitude": 15.8700, "longitude": 100.9925
    },
    {
        "id": "VN", "name": "Vietnam", "iso2": "VN", "iso3": "VNM", "capital": "Hanoi",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "VND",
        "languages": "Vietnamese", "flag_emoji": "🇻🇳", "latitude": 14.0583, "longitude": 108.2772
    },
    {
        "id": "SG", "name": "Singapore", "iso2": "SG", "iso3": "SGP", "capital": "Singapore",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "SGD",
        "languages": "English, Malay, Mandarin, Tamil", "flag_emoji": "🇸🇬", "latitude": 1.3521, "longitude": 103.8198
    },
    {
        "id": "MY", "name": "Malaysia", "iso2": "MY", "iso3": "MYS", "capital": "Kuala Lumpur",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "MYR",
        "languages": "Malay, English", "flag_emoji": "🇲🇾", "latitude": 4.2105, "longitude": 101.9758
    },
    {
        "id": "PH", "name": "Philippines", "iso2": "PH", "iso3": "PHL", "capital": "Manila",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "PHP",
        "languages": "Filipino, English", "flag_emoji": "🇵🇭", "latitude": 12.8797, "longitude": 121.7740
    },
    {
        "id": "KR", "name": "South Korea", "iso2": "KR", "iso3": "KOR", "capital": "Seoul",
        "continent": "Asia", "region": "Eastern Asia", "currency_code": "KRW",
        "languages": "Korean", "flag_emoji": "🇰🇷", "latitude": 35.9078, "longitude": 127.7669
    },
    {
        "id": "AE", "name": "United Arab Emirates", "iso2": "AE", "iso3": "ARE", "capital": "Abu Dhabi",
        "continent": "Asia", "region": "Western Asia", "currency_code": "AED",
        "languages": "Arabic, English", "flag_emoji": "🇦🇪", "latitude": 23.4241, "longitude": 53.8478
    },
    {
        "id": "SA", "name": "Saudi Arabia", "iso2": "SA", "iso3": "SAU", "capital": "Riyadh",
        "continent": "Asia", "region": "Western Asia", "currency_code": "SAR",
        "languages": "Arabic", "flag_emoji": "🇸🇦", "latitude": 23.8859, "longitude": 45.0792
    },
    {
        "id": "NP", "name": "Nepal", "iso2": "NP", "iso3": "NPL", "capital": "Kathmandu",
        "continent": "Asia", "region": "Southern Asia", "currency_code": "NPR",
        "languages": "Nepali", "flag_emoji": "🇳🇵", "latitude": 28.3949, "longitude": 84.1240
    },
    {
        "id": "LK", "name": "Sri Lanka", "iso2": "LK", "iso3": "LKA", "capital": "Colombo",
        "continent": "Asia", "region": "Southern Asia", "currency_code": "LKR",
        "languages": "Sinhala, Tamil", "flag_emoji": "🇱🇰", "latitude": 7.8731, "longitude": 80.7718
    },
    {
        "id": "MV", "name": "Maldives", "iso2": "MV", "iso3": "MDV", "capital": "Malé",
        "continent": "Asia", "region": "Southern Asia", "currency_code": "MVR",
        "languages": "Dhivehi", "flag_emoji": "🇲🇻", "latitude": 3.2028, "longitude": 73.2207
    },
    {
        "id": "TR", "name": "Turkey", "iso2": "TR", "iso3": "TUR", "capital": "Ankara",
        "continent": "Asia", "region": "Western Asia", "currency_code": "TRY",
        "languages": "Turkish", "flag_emoji": "🇹🇷", "latitude": 38.9637, "longitude": 35.2433
    },
    {
        "id": "IL", "name": "Israel", "iso2": "IL", "iso3": "ISR", "capital": "Jerusalem",
        "continent": "Asia", "region": "Western Asia", "currency_code": "ILS",
        "languages": "Hebrew, Arabic", "flag_emoji": "🇮🇱", "latitude": 31.0461, "longitude": 34.8516
    },
    {
        "id": "JO", "name": "Jordan", "iso2": "JO", "iso3": "JOR", "capital": "Amman",
        "continent": "Asia", "region": "Western Asia", "currency_code": "JOD",
        "languages": "Arabic", "flag_emoji": "🇯🇴", "latitude": 30.5852, "longitude": 36.2384
    },
    {
        "id": "QA", "name": "Qatar", "iso2": "QA", "iso3": "QAT", "capital": "Doha",
        "continent": "Asia", "region": "Western Asia", "currency_code": "QAR",
        "languages": "Arabic", "flag_emoji": "🇶🇦", "latitude": 25.3548, "longitude": 51.1839
    },
    {
        "id": "OM", "name": "Oman", "iso2": "OM", "iso3": "OMN", "capital": "Muscat",
        "continent": "Asia", "region": "Western Asia", "currency_code": "OMR",
        "languages": "Arabic", "flag_emoji": "🇴🇲", "latitude": 21.5126, "longitude": 55.9233
    },
    {
        "id": "TW", "name": "Taiwan", "iso2": "TW", "iso3": "TWN", "capital": "Taipei",
        "continent": "Asia", "region": "Eastern Asia", "currency_code": "TWD",
        "languages": "Mandarin Chinese", "flag_emoji": "🇹🇼", "latitude": 23.6978, "longitude": 120.9605
    },
    {
        "id": "KH", "name": "Cambodia", "iso2": "KH", "iso3": "KHM", "capital": "Phnom Penh",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "KHR",
        "languages": "Khmer", "flag_emoji": "🇰🇭", "latitude": 12.5657, "longitude": 104.9910
    },
    {
        "id": "LA", "name": "Laos", "iso2": "LA", "iso3": "LAO", "capital": "Vientiane",
        "continent": "Asia", "region": "South-Eastern Asia", "currency_code": "LAK",
        "languages": "Lao", "flag_emoji": "🇱🇦", "latitude": 19.8563, "longitude": 102.4955
    },
    {
        "id": "BT", "name": "Bhutan", "iso2": "BT", "iso3": "BTN", "capital": "Thimphu",
        "continent": "Asia", "region": "Southern Asia", "currency_code": "BTN",
        "languages": "Dzongkha", "flag_emoji": "🇧🇹", "latitude": 27.5142, "longitude": 90.4336
    },
    {
        "id": "UZ", "name": "Uzbekistan", "iso2": "UZ", "iso3": "UZB", "capital": "Tashkent",
        "continent": "Asia", "region": "Central Asia", "currency_code": "UZS",
        "languages": "Uzbek", "flag_emoji": "🇺🇿", "latitude": 41.3775, "longitude": 64.5853
    },
    {
        "id": "KZ", "name": "Kazakhstan", "iso2": "KZ", "iso3": "KAZ", "capital": "Astana",
        "continent": "Asia", "region": "Central Asia", "currency_code": "KZT",
        "languages": "Kazakh, Russian", "flag_emoji": "🇰🇿", "latitude": 48.0196, "longitude": 66.9237
    },
    {
        "id": "BH", "name": "Bahrain", "iso2": "BH", "iso3": "BHR", "capital": "Manama",
        "continent": "Asia", "region": "Western Asia", "currency_code": "BHD",
        "languages": "Arabic", "flag_emoji": "🇧🇭", "latitude": 26.0667, "longitude": 50.5577
    },
    {
        "id": "KW", "name": "Kuwait", "iso2": "KW", "iso3": "KWT", "capital": "Kuwait City",
        "continent": "Asia", "region": "Western Asia", "currency_code": "KWD",
        "languages": "Arabic", "flag_emoji": "🇰🇼", "latitude": 29.3117, "longitude": 47.4818
    },
    {
        "id": "GE", "name": "Georgia", "iso2": "GE", "iso3": "GEO", "capital": "Tbilisi",
        "continent": "Asia", "region": "Western Asia", "currency_code": "GEL",
        "languages": "Georgian", "flag_emoji": "🇬🇪", "latitude": 42.3154, "longitude": 43.3569
    },
    {
        "id": "AM", "name": "Armenia", "iso2": "AM", "iso3": "ARM", "capital": "Yerevan",
        "continent": "Asia", "region": "Western Asia", "currency_code": "AMD",
        "languages": "Armenian", "flag_emoji": "🇦🇲", "latitude": 40.0691, "longitude": 45.0382
    },

    # EUROPE
    {
        "id": "GB", "name": "United Kingdom", "iso2": "GB", "iso3": "GBR", "capital": "London",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "GBP",
        "languages": "English", "flag_emoji": "🇬🇧", "latitude": 55.3781, "longitude": -3.4360
    },
    {
        "id": "FR", "name": "France", "iso2": "FR", "iso3": "FRA", "capital": "Paris",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "French", "flag_emoji": "🇫🇷", "latitude": 46.2276, "longitude": 2.2137
    },
    {
        "id": "DE", "name": "Germany", "iso2": "DE", "iso3": "DEU", "capital": "Berlin",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "German", "flag_emoji": "🇩🇪", "latitude": 51.1657, "longitude": 10.4515
    },
    {
        "id": "IT", "name": "Italy", "iso2": "IT", "iso3": "ITA", "capital": "Rome",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Italian", "flag_emoji": "🇮🇹", "latitude": 41.8719, "longitude": 12.5674
    },
    {
        "id": "ES", "name": "Spain", "iso2": "ES", "iso3": "ESP", "capital": "Madrid",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Spanish, Catalan, Basque, Galician", "flag_emoji": "🇪🇸", "latitude": 40.4637, "longitude": -3.7492
    },
    {
        "id": "CH", "name": "Switzerland", "iso2": "CH", "iso3": "CHE", "capital": "Bern",
        "continent": "Europe", "region": "Western Europe", "currency_code": "CHF",
        "languages": "German, French, Italian, Romansh", "flag_emoji": "🇨🇭", "latitude": 46.8182, "longitude": 8.2275
    },
    {
        "id": "NL", "name": "Netherlands", "iso2": "NL", "iso3": "NLD", "capital": "Amsterdam",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "Dutch", "flag_emoji": "🇳🇱", "latitude": 52.1326, "longitude": 5.2913
    },
    {
        "id": "GR", "name": "Greece", "iso2": "GR", "iso3": "GRC", "capital": "Athens",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Greek", "flag_emoji": "🇬🇷", "latitude": 39.0742, "longitude": 21.8243
    },
    {
        "id": "PT", "name": "Portugal", "iso2": "PT", "iso3": "PRT", "capital": "Lisbon",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Portuguese", "flag_emoji": "🇵🇹", "latitude": 39.3999, "longitude": -8.2245
    },
    {
        "id": "AT", "name": "Austria", "iso2": "AT", "iso3": "AUT", "capital": "Vienna",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "German", "flag_emoji": "🇦🇹", "latitude": 47.5162, "longitude": 14.5501
    },
    {
        "id": "BE", "name": "Belgium", "iso2": "BE", "iso3": "BEL", "capital": "Brussels",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "Dutch, French, German", "flag_emoji": "🇧🇪", "latitude": 50.5039, "longitude": 4.4699
    },
    {
        "id": "IE", "name": "Ireland", "iso2": "IE", "iso3": "IRL", "capital": "Dublin",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "EUR",
        "languages": "English, Irish", "flag_emoji": "🇮🇪", "latitude": 53.1424, "longitude": -7.6921
    },
    {
        "id": "NO", "name": "Norway", "iso2": "NO", "iso3": "NOR", "capital": "Oslo",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "NOK",
        "languages": "Norwegian", "flag_emoji": "🇳🇴", "latitude": 60.4720, "longitude": 8.4689
    },
    {
        "id": "SE", "name": "Sweden", "iso2": "SE", "iso3": "SWE", "capital": "Stockholm",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "SEK",
        "languages": "Swedish", "flag_emoji": "🇸🇪", "latitude": 60.1282, "longitude": 18.6435
    },
    {
        "id": "DK", "name": "Denmark", "iso2": "DK", "iso3": "DNK", "capital": "Copenhagen",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "DKK",
        "languages": "Danish", "flag_emoji": "🇩🇰", "latitude": 56.2639, "longitude": 9.5018
    },
    {
        "id": "FI", "name": "Finland", "iso2": "FI", "iso3": "FIN", "capital": "Helsinki",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "EUR",
        "languages": "Finnish, Swedish", "flag_emoji": "🇫🇮", "latitude": 61.9241, "longitude": 25.7482
    },
    {
        "id": "IS", "name": "Iceland", "iso2": "IS", "iso3": "ISL", "capital": "Reykjavík",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "ISK",
        "languages": "Icelandic", "flag_emoji": "🇮🇸", "latitude": 64.9631, "longitude": -19.0208
    },
    {
        "id": "PL", "name": "Poland", "iso2": "PL", "iso3": "POL", "capital": "Warsaw",
        "continent": "Europe", "region": "Eastern Europe", "currency_code": "PLN",
        "languages": "Polish", "flag_emoji": "🇵🇱", "latitude": 51.9194, "longitude": 19.1451
    },
    {
        "id": "CZ", "name": "Czech Republic", "iso2": "CZ", "iso3": "CZE", "capital": "Prague",
        "continent": "Europe", "region": "Eastern Europe", "currency_code": "CZK",
        "languages": "Czech", "flag_emoji": "🇨🇿", "latitude": 49.8175, "longitude": 15.4730
    },
    {
        "id": "HR", "name": "Croatia", "iso2": "HR", "iso3": "HRV", "capital": "Zagreb",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Croatian", "flag_emoji": "🇭🇷", "latitude": 45.1000, "longitude": 15.2000
    },
    {
        "id": "HU", "name": "Hungary", "iso2": "HU", "iso3": "HUN", "capital": "Budapest",
        "continent": "Europe", "region": "Eastern Europe", "currency_code": "HUF",
        "languages": "Hungarian", "flag_emoji": "🇭🇺", "latitude": 47.1625, "longitude": 19.5033
    },
    {
        "id": "RO", "name": "Romania", "iso2": "RO", "iso3": "ROU", "capital": "Bucharest",
        "continent": "Europe", "region": "Eastern Europe", "currency_code": "RON",
        "languages": "Romanian", "flag_emoji": "🇷🇴", "latitude": 45.9432, "longitude": 24.9668
    },
    {
        "id": "BG", "name": "Bulgaria", "iso2": "BG", "iso3": "BGR", "capital": "Sofia",
        "continent": "Europe", "region": "Eastern Europe", "currency_code": "BGN",
        "languages": "Bulgarian", "flag_emoji": "🇧🇬", "latitude": 42.7339, "longitude": 25.4858
    },
    {
        "id": "SI", "name": "Slovenia", "iso2": "SI", "iso3": "SVN", "capital": "Ljubljana",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Slovene", "flag_emoji": "🇸🇮", "latitude": 46.1512, "longitude": 14.9955
    },
    {
        "id": "SK", "name": "Slovakia", "iso2": "SK", "iso3": "SVK", "capital": "Bratislava",
        "continent": "Europe", "region": "Eastern Europe", "currency_code": "EUR",
        "languages": "Slovak", "flag_emoji": "🇸🇰", "latitude": 48.6690, "longitude": 19.6990
    },
    {
        "id": "EE", "name": "Estonia", "iso2": "EE", "iso3": "EST", "capital": "Tallinn",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "EUR",
        "languages": "Estonian", "flag_emoji": "🇪🇪", "latitude": 58.5953, "longitude": 25.0136
    },
    {
        "id": "LV", "name": "Latvia", "iso2": "LV", "iso3": "LVA", "capital": "Riga",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "EUR",
        "languages": "Latvian", "flag_emoji": "🇱🇻", "latitude": 56.8796, "longitude": 24.6032
    },
    {
        "id": "LT", "name": "Lithuania", "iso2": "LT", "iso3": "LTU", "capital": "Vilnius",
        "continent": "Europe", "region": "Northern Europe", "currency_code": "EUR",
        "languages": "Lithuanian", "flag_emoji": "🇱🇹", "latitude": 55.1694, "longitude": 23.8813
    },
    {
        "id": "CY", "name": "Cyprus", "iso2": "CY", "iso3": "CYP", "capital": "Nicosia",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Greek, Turkish", "flag_emoji": "🇨🇾", "latitude": 35.1264, "longitude": 33.4299
    },
    {
        "id": "MT", "name": "Malta", "iso2": "MT", "iso3": "MLT", "capital": "Valletta",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Maltese, English", "flag_emoji": "🇲🇹", "latitude": 35.9375, "longitude": 14.3754
    },
    {
        "id": "LU", "name": "Luxembourg", "iso2": "LU", "iso3": "LUX", "capital": "Luxembourg",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "Luxembourgish, French, German", "flag_emoji": "🇱🇺", "latitude": 49.8153, "longitude": 6.1296
    },
    {
        "id": "MC", "name": "Monaco", "iso2": "MC", "iso3": "MCO", "capital": "Monaco",
        "continent": "Europe", "region": "Western Europe", "currency_code": "EUR",
        "languages": "French", "flag_emoji": "🇲🇨", "latitude": 43.7384, "longitude": 7.4246
    },
    {
        "id": "AD", "name": "Andorra", "iso2": "AD", "iso3": "AND", "capital": "Andorra la Vella",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Catalan", "flag_emoji": "🇦🇩", "latitude": 42.5063, "longitude": 1.5218
    },
    {
        "id": "ME", "name": "Montenegro", "iso2": "ME", "iso3": "MNE", "capital": "Podgorica",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "EUR",
        "languages": "Montenegrin", "flag_emoji": "🇲🇪", "latitude": 42.7087, "longitude": 19.3744
    },
    {
        "id": "RS", "name": "Serbia", "iso2": "RS", "iso3": "SRB", "capital": "Belgrade",
        "continent": "Europe", "region": "Southern Europe", "currency_code": "RSD",
        "languages": "Serbian", "flag_emoji": "🇷🇸", "latitude": 44.0165, "longitude": 21.0059
    },

    # NORTH & CENTRAL AMERICA
    {
        "id": "US", "name": "United States", "iso2": "US", "iso3": "USA", "capital": "Washington, D.C.",
        "continent": "North America", "region": "Northern America", "currency_code": "USD",
        "languages": "English, Spanish", "flag_emoji": "🇺🇸", "latitude": 37.0902, "longitude": -95.7129
    },
    {
        "id": "CA", "name": "Canada", "iso2": "CA", "iso3": "CAN", "capital": "Ottawa",
        "continent": "North America", "region": "Northern America", "currency_code": "CAD",
        "languages": "English, French", "flag_emoji": "🇨🇦", "latitude": 56.1304, "longitude": -106.3468
    },
    {
        "id": "MX", "name": "Mexico", "iso2": "MX", "iso3": "MEX", "capital": "Mexico City",
        "continent": "North America", "region": "Central America", "currency_code": "MXN",
        "languages": "Spanish", "flag_emoji": "🇲🇽", "latitude": 23.6345, "longitude": -102.5528
    },
    {
        "id": "CR", "name": "Costa Rica", "iso2": "CR", "iso3": "CRI", "capital": "San José",
        "continent": "North America", "region": "Central America", "currency_code": "CRC",
        "languages": "Spanish", "flag_emoji": "🇨🇷", "latitude": 9.7489, "longitude": -83.7534
    },
    {
        "id": "PA", "name": "Panama", "iso2": "PA", "iso3": "PAN", "capital": "Panama City",
        "continent": "North America", "region": "Central America", "currency_code": "PAB, USD",
        "languages": "Spanish", "flag_emoji": "🇵🇦", "latitude": 8.5379, "longitude": -80.7821
    },
    {
        "id": "JM", "name": "Jamaica", "iso2": "JM", "iso3": "JAM", "capital": "Kingston",
        "continent": "North America", "region": "Caribbean", "currency_code": "JMD",
        "languages": "English", "flag_emoji": "🇯🇲", "latitude": 18.1096, "longitude": -77.2975
    },
    {
        "id": "CU", "name": "Cuba", "iso2": "CU", "iso3": "CUB", "capital": "Havana",
        "continent": "North America", "region": "Caribbean", "currency_code": "CUP",
        "languages": "Spanish", "flag_emoji": "🇨🇺", "latitude": 21.5218, "longitude": -77.7812
    },
    {
        "id": "DO", "name": "Dominican Republic", "iso2": "DO", "iso3": "DOM", "capital": "Santo Domingo",
        "continent": "North America", "region": "Caribbean", "currency_code": "DOP",
        "languages": "Spanish", "flag_emoji": "🇩🇴", "latitude": 18.7357, "longitude": -70.1627
    },
    {
        "id": "BS", "name": "Bahamas", "iso2": "BS", "iso3": "BHS", "capital": "Nassau",
        "continent": "North America", "region": "Caribbean", "currency_code": "BSD",
        "languages": "English", "flag_emoji": "🇧🇸", "latitude": 25.0343, "longitude": -77.3963
    },
    {
        "id": "GT", "name": "Guatemala", "iso2": "GT", "iso3": "GTM", "capital": "Guatemala City",
        "continent": "North America", "region": "Central America", "currency_code": "GTQ",
        "languages": "Spanish", "flag_emoji": "🇬🇹", "latitude": 15.7835, "longitude": -90.2308
    },
    {
        "id": "BZ", "name": "Belize", "iso2": "BZ", "iso3": "BLZ", "capital": "Belmopan",
        "continent": "North America", "region": "Central America", "currency_code": "BZD",
        "languages": "English", "flag_emoji": "🇧🇿", "latitude": 17.1899, "longitude": -88.4976
    },
    {
        "id": "HN", "name": "Honduras", "iso2": "HN", "iso3": "HND", "capital": "Tegucigalpa",
        "continent": "North America", "region": "Central America", "currency_code": "HNL",
        "languages": "Spanish", "flag_emoji": "🇭🇳", "latitude": 15.2000, "longitude": -86.2419
    },
    {
        "id": "SV", "name": "El Salvador", "iso2": "SV", "iso3": "SLV", "capital": "San Salvador",
        "continent": "North America", "region": "Central America", "currency_code": "USD",
        "languages": "Spanish", "flag_emoji": "🇸🇻", "latitude": 13.7942, "longitude": -88.8965
    },
    {
        "id": "BB", "name": "Barbados", "iso2": "BB", "iso3": "BRB", "capital": "Bridgetown",
        "continent": "North America", "region": "Caribbean", "currency_code": "BBD",
        "languages": "English", "flag_emoji": "🇧🇧", "latitude": 13.1939, "longitude": -59.5432
    },
    {
        "id": "TT", "name": "Trinidad and Tobago", "iso2": "TT", "iso3": "TTO", "capital": "Port of Spain",
        "continent": "North America", "region": "Caribbean", "currency_code": "TTD",
        "languages": "English", "flag_emoji": "🇹🇹", "latitude": 10.6918, "longitude": -61.2225
    },

    # SOUTH AMERICA
    {
        "id": "BR", "name": "Brazil", "iso2": "BR", "iso3": "BRA", "capital": "Brasília",
        "continent": "South America", "region": "South America", "currency_code": "BRL",
        "languages": "Portuguese", "flag_emoji": "🇧🇷", "latitude": -14.2350, "longitude": -51.9253
    },
    {
        "id": "AR", "name": "Argentina", "iso2": "AR", "iso3": "ARG", "capital": "Buenos Aires",
        "continent": "South America", "region": "South America", "currency_code": "ARS",
        "languages": "Spanish", "flag_emoji": "🇦🇷", "latitude": -38.4161, "longitude": -63.6167
    },
    {
        "id": "CO", "name": "Colombia", "iso2": "CO", "iso3": "COL", "capital": "Bogotá",
        "continent": "South America", "region": "South America", "currency_code": "COP",
        "languages": "Spanish", "flag_emoji": "🇨🇴", "latitude": 4.5709, "longitude": -74.2973
    },
    {
        "id": "PE", "name": "Peru", "iso2": "PE", "iso3": "PER", "capital": "Lima",
        "continent": "South America", "region": "South America", "currency_code": "PEN",
        "languages": "Spanish, Quechua", "flag_emoji": "🇵🇪", "latitude": -9.1900, "longitude": -75.0152
    },
    {
        "id": "CL", "name": "Chile", "iso2": "CL", "iso3": "CHL", "capital": "Santiago",
        "continent": "South America", "region": "South America", "currency_code": "CLP",
        "languages": "Spanish", "flag_emoji": "🇨🇱", "latitude": -35.6751, "longitude": -71.5430
    },
    {
        "id": "EC", "name": "Ecuador", "iso2": "EC", "iso3": "ECU", "capital": "Quito",
        "continent": "South America", "region": "South America", "currency_code": "USD",
        "languages": "Spanish", "flag_emoji": "🇪🇨", "latitude": -1.8312, "longitude": -78.1834
    },
    {
        "id": "UY", "name": "Uruguay", "iso2": "UY", "iso3": "URY", "capital": "Montevideo",
        "continent": "South America", "region": "South America", "currency_code": "UYU",
        "languages": "Spanish", "flag_emoji": "🇺🇾", "latitude": -32.5228, "longitude": -55.7658
    },
    {
        "id": "BO", "name": "Bolivia", "iso2": "BO", "iso3": "BOL", "capital": "Sucre",
        "continent": "South America", "region": "South America", "currency_code": "BOB",
        "languages": "Spanish, Quechua, Aymara", "flag_emoji": "🇧🇴", "latitude": -16.2902, "longitude": -63.5887
    },
    {
        "id": "PY", "name": "Paraguay", "iso2": "PY", "iso3": "PRY", "capital": "Asunción",
        "continent": "South America", "region": "South America", "currency_code": "PYG",
        "languages": "Spanish, Guaraní", "flag_emoji": "🇵🇾", "latitude": -23.4425, "longitude": -58.4438
    },
    {
        "id": "VE", "name": "Venezuela", "iso2": "VE", "iso3": "VEN", "capital": "Caracas",
        "continent": "South America", "region": "South America", "currency_code": "VES",
        "languages": "Spanish", "flag_emoji": "🇻🇪", "latitude": 6.4238, "longitude": -66.5897
    },
    {
        "id": "GY", "name": "Guyana", "iso2": "GY", "iso3": "GUY", "capital": "Georgetown",
        "continent": "South America", "region": "South America", "currency_code": "GYD",
        "languages": "English", "flag_emoji": "🇬🇾", "latitude": 4.8604, "longitude": -58.9302
    },
    {
        "id": "SR", "name": "Suriname", "iso2": "SR", "iso3": "SUR", "capital": "Paramaribo",
        "continent": "South America", "region": "South America", "currency_code": "SRD",
        "languages": "Dutch", "flag_emoji": "🇸🇷", "latitude": 3.9193, "longitude": -56.0278
    },

    # AFRICA
    {
        "id": "ZA", "name": "South Africa", "iso2": "ZA", "iso3": "ZAF", "capital": "Pretoria",
        "continent": "Africa", "region": "Southern Africa", "currency_code": "ZAR",
        "languages": "Zulu, Xhosa, Afrikaans, English", "flag_emoji": "🇿🇦", "latitude": -30.5595, "longitude": 22.9375
    },
    {
        "id": "EG", "name": "Egypt", "iso2": "EG", "iso3": "EGY", "capital": "Cairo",
        "continent": "Africa", "region": "Northern Africa", "currency_code": "EGP",
        "languages": "Arabic", "flag_emoji": "🇪🇬", "latitude": 26.8206, "longitude": 30.8025
    },
    {
        "id": "MA", "name": "Morocco", "iso2": "MA", "iso3": "MAR", "capital": "Rabat",
        "continent": "Africa", "region": "Northern Africa", "currency_code": "MAD",
        "languages": "Arabic, Berber, French", "flag_emoji": "🇲🇦", "latitude": 31.7917, "longitude": -7.0926
    },
    {
        "id": "KE", "name": "Kenya", "iso2": "KE", "iso3": "KEN", "capital": "Nairobi",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "KES",
        "languages": "Swahili, English", "flag_emoji": "🇰🇪", "latitude": -0.0236, "longitude": 37.9062
    },
    {
        "id": "TZ", "name": "Tanzania", "iso2": "TZ", "iso3": "TZA", "capital": "Dodoma",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "TZS",
        "languages": "Swahili, English", "flag_emoji": "🇹🇿", "latitude": -6.3690, "longitude": 34.8888
    },
    {
        "id": "SC", "name": "Seychelles", "iso2": "SC", "iso3": "SYC", "capital": "Victoria",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "SCR",
        "languages": "Seychellois Creole, English, French", "flag_emoji": "🇸🇨", "latitude": -4.6796, "longitude": 55.4920
    },
    {
        "id": "MU", "name": "Mauritius", "iso2": "MU", "iso3": "MUS", "capital": "Port Louis",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "MUR",
        "languages": "English, French, Mauritian Creole", "flag_emoji": "🇲🇺", "latitude": -20.3484, "longitude": 57.5522
    },
    {
        "id": "NG", "name": "Nigeria", "iso2": "NG", "iso3": "NGA", "capital": "Abuja",
        "continent": "Africa", "region": "Western Africa", "currency_code": "NGN",
        "languages": "English, Hausa, Yoruba, Igbo", "flag_emoji": "🇳🇬", "latitude": 9.0820, "longitude": 8.6753
    },
    {
        "id": "GH", "name": "Ghana", "iso2": "GH", "iso3": "GHA", "capital": "Accra",
        "continent": "Africa", "region": "Western Africa", "currency_code": "GHS",
        "languages": "English", "flag_emoji": "🇬🇭", "latitude": 7.9465, "longitude": -1.0232
    },
    {
        "id": "ET", "name": "Ethiopia", "iso2": "ET", "iso3": "ETH", "capital": "Addis Ababa",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "ETB",
        "languages": "Amharic", "flag_emoji": "🇪🇹", "latitude": 9.1450, "longitude": 40.4897
    },
    {
        "id": "RW", "name": "Rwanda", "iso2": "RW", "iso3": "RWA", "capital": "Kigali",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "RWF",
        "languages": "Kinyarwanda, French, English", "flag_emoji": "🇷🇼", "latitude": -1.9403, "longitude": 29.8739
    },
    {
        "id": "NA", "name": "Namibia", "iso2": "NA", "iso3": "NAM", "capital": "Windhoek",
        "continent": "Africa", "region": "Southern Africa", "currency_code": "NAD",
        "languages": "English, Afrikaans, German", "flag_emoji": "🇳🇦", "latitude": -22.9576, "longitude": 18.4904
    },
    {
        "id": "BW", "name": "Botswana", "iso2": "BW", "iso3": "BWA", "capital": "Gaborone",
        "continent": "Africa", "region": "Southern Africa", "currency_code": "BWP",
        "languages": "English, Setswana", "flag_emoji": "🇧🇼", "latitude": -22.3285, "longitude": 24.6849
    },
    {
        "id": "TN", "name": "Tunisia", "iso2": "TN", "iso3": "TUN", "capital": "Tunis",
        "continent": "Africa", "region": "Northern Africa", "currency_code": "TND",
        "languages": "Arabic, French", "flag_emoji": "🇹🇳", "latitude": 33.8869, "longitude": 9.5375
    },
    {
        "id": "UG", "name": "Uganda", "iso2": "UG", "iso3": "UGA", "capital": "Kampala",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "UGX",
        "languages": "English, Swahili", "flag_emoji": "🇺🇬", "latitude": 1.3733, "longitude": 32.2903
    },
    {
        "id": "SN", "name": "Senegal", "iso2": "SN", "iso3": "SEN", "capital": "Dakar",
        "continent": "Africa", "region": "Western Africa", "currency_code": "XOF",
        "languages": "French, Wolof", "flag_emoji": "🇸🇳", "latitude": 14.4974, "longitude": -14.4524
    },
    {
        "id": "MG", "name": "Madagascar", "iso2": "MG", "iso3": "MDG", "capital": "Antananarivo",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "MGA",
        "languages": "Malagasy, French", "flag_emoji": "🇲🇬", "latitude": -18.7669, "longitude": 46.8691
    },
    {
        "id": "ZW", "name": "Zimbabwe", "iso2": "ZW", "iso3": "ZWE", "capital": "Harare",
        "continent": "Africa", "region": "Southern Africa", "currency_code": "USD, ZWL",
        "languages": "English, Shona, Ndebele", "flag_emoji": "🇿🇼", "latitude": -19.0154, "longitude": 29.1549
    },
    {
        "id": "ZM", "name": "Zambia", "iso2": "ZM", "iso3": "ZMB", "capital": "Lusaka",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "ZMW",
        "languages": "English", "flag_emoji": "🇿🇲", "latitude": -13.1339, "longitude": 27.8493
    },
    {
        "id": "CI", "name": "Ivory Coast", "iso2": "CI", "iso3": "CIV", "capital": "Yamoussoukro",
        "continent": "Africa", "region": "Western Africa", "currency_code": "XOF",
        "languages": "French", "flag_emoji": "🇨🇮", "latitude": 7.5400, "longitude": -5.5471
    },
    {
        "id": "DZ", "name": "Algeria", "iso2": "DZ", "iso3": "DZA", "capital": "Algiers",
        "continent": "Africa", "region": "Northern Africa", "currency_code": "DZD",
        "languages": "Arabic, Berber, French", "flag_emoji": "🇩🇿", "latitude": 28.0339, "longitude": 1.6596
    },
    {
        "id": "CV", "name": "Cape Verde", "iso2": "CV", "iso3": "CPV", "capital": "Praia",
        "continent": "Africa", "region": "Western Africa", "currency_code": "CVE",
        "languages": "Portuguese", "flag_emoji": "🇨🇻", "latitude": 16.5388, "longitude": -23.0418
    },
    {
        "id": "MZ", "name": "Mozambique", "iso2": "MZ", "iso3": "MOZ", "capital": "Maputo",
        "continent": "Africa", "region": "Eastern Africa", "currency_code": "MZN",
        "languages": "Portuguese", "flag_emoji": "🇲🇿", "latitude": -18.6657, "longitude": 35.5296
    },
    {
        "id": "CM", "name": "Cameroon", "iso2": "CM", "iso3": "CMR", "capital": "Yaoundé",
        "continent": "Africa", "region": "Middle Africa", "currency_code": "XAF",
        "languages": "French, English", "flag_emoji": "🇨🇲", "latitude": 7.3697, "longitude": 12.3547
    },

    # OCEANIA
    {
        "id": "AU", "name": "Australia", "iso2": "AU", "iso3": "AUS", "capital": "Canberra",
        "continent": "Oceania", "region": "Australia and New Zealand", "currency_code": "AUD",
        "languages": "English", "flag_emoji": "🇦🇺", "latitude": -25.2744, "longitude": 133.7751
    },
    {
        "id": "NZ", "name": "New Zealand", "iso2": "NZ", "iso3": "NZL", "capital": "Wellington",
        "continent": "Oceania", "region": "Australia and New Zealand", "currency_code": "NZD",
        "languages": "English, Māori", "flag_emoji": "🇳🇿", "latitude": -40.9006, "longitude": 174.8860
    },
    {
        "id": "FJ", "name": "Fiji", "iso2": "FJ", "iso3": "FJI", "capital": "Suva",
        "continent": "Oceania", "region": "Melanesia", "currency_code": "FJD",
        "languages": "English, Fijian, Hindi", "flag_emoji": "🇫🇯", "latitude": -17.7134, "longitude": 178.0650
    },
    {
        "id": "WS", "name": "Samoa", "iso2": "WS", "iso3": "WSM", "capital": "Apia",
        "continent": "Oceania", "region": "Polynesia", "currency_code": "WST",
        "languages": "Samoan, English", "flag_emoji": "🇼🇸", "latitude": -13.7590, "longitude": -172.1046
    },
    {
        "id": "PG", "name": "Papua New Guinea", "iso2": "PG", "iso3": "PNG", "capital": "Port Moresby",
        "continent": "Oceania", "region": "Melanesia", "currency_code": "PGK",
        "languages": "English, Tok Pisin, Hiri Motu", "flag_emoji": "🇵🇬", "latitude": -6.3150, "longitude": 143.9555
    },
    {
        "id": "PF", "name": "French Polynesia", "iso2": "PF", "iso3": "PYF", "capital": "Papeete",
        "continent": "Oceania", "region": "Polynesia", "currency_code": "XPF",
        "languages": "French, Tahitian", "flag_emoji": "🇵🇫", "latitude": -17.6797, "longitude": -149.4068
    },
    {
        "id": "VU", "name": "Vanuatu", "iso2": "VU", "iso3": "VUT", "capital": "Port Vila",
        "continent": "Oceania", "region": "Melanesia", "currency_code": "VUV",
        "languages": "Bislama, English, French", "flag_emoji": "🇻🇺", "latitude": -15.3767, "longitude": 166.9592
    },
    {
        "id": "TO", "name": "Tonga", "iso2": "TO", "iso3": "TON", "capital": "Nukuʻalofa",
        "continent": "Oceania", "region": "Polynesia", "currency_code": "TOP",
        "languages": "Tongan, English", "flag_emoji": "🇹🇴", "latitude": -21.1790, "longitude": -175.1982
    },
    {
        "id": "SB", "name": "Solomon Islands", "iso2": "SB", "iso3": "SLB", "capital": "Honiara",
        "continent": "Oceania", "region": "Melanesia", "currency_code": "SBD",
        "languages": "English", "flag_emoji": "🇸🇧", "latitude": -9.6457, "longitude": 160.1562
    },
    {
        "id": "PW", "name": "Palau", "iso2": "PW", "iso3": "PLW", "capital": "Ngerulmud",
        "continent": "Oceania", "region": "Micronesia", "currency_code": "USD",
        "languages": "Palauan, English", "flag_emoji": "🇵🇼", "latitude": 7.5150, "longitude": 134.5825
    },
]

# ADMINISTRATIVE REGIONS SEED (Sample representing global major divisions)
REGIONS_SEED = [
    # India
    {"id": "IN.KL", "country_id": "IN", "name": "Kerala", "region_code": "KL", "region_type": "State"},
    {"id": "IN.TN", "country_id": "IN", "name": "Tamil Nadu", "region_code": "TN", "region_type": "State"},
    {"id": "IN.KA", "country_id": "IN", "name": "Karnataka", "region_code": "KA", "region_type": "State"},
    {"id": "IN.MH", "country_id": "IN", "name": "Maharashtra", "region_code": "MH", "region_type": "State"},
    {"id": "IN.RJ", "country_id": "IN", "name": "Rajasthan", "region_code": "RJ", "region_type": "State"},
    {"id": "IN.GA", "country_id": "IN", "name": "Goa", "region_code": "GA", "region_type": "State"},
    {"id": "IN.DL", "country_id": "IN", "name": "Delhi", "region_code": "DL", "region_type": "Union Territory"},
    {"id": "IN.UT", "country_id": "IN", "name": "Uttarakhand", "region_code": "UT", "region_type": "State"},
    {"id": "IN.HP", "country_id": "IN", "name": "Himachal Pradesh", "region_code": "HP", "region_type": "State"},
    {"id": "IN.WB", "country_id": "IN", "name": "West Bengal", "region_code": "WB", "region_type": "State"},

    # Japan
    {"id": "JP.13", "country_id": "JP", "name": "Tokyo", "region_code": "13", "region_type": "Prefecture"},
    {"id": "JP.26", "country_id": "JP", "name": "Kyoto", "region_code": "26", "region_type": "Prefecture"},
    {"id": "JP.27", "country_id": "JP", "name": "Osaka", "region_code": "27", "region_type": "Prefecture"},
    {"id": "JP.01", "country_id": "JP", "name": "Hokkaido", "region_code": "01", "region_type": "Prefecture"},
    {"id": "JP.47", "country_id": "JP", "name": "Okinawa", "region_code": "47", "region_type": "Prefecture"},

    # United States
    {"id": "US.CA", "country_id": "US", "name": "California", "region_code": "CA", "region_type": "State"},
    {"id": "US.NY", "country_id": "US", "name": "New York", "region_code": "NY", "region_type": "State"},
    {"id": "US.HI", "country_id": "US", "name": "Hawaii", "region_code": "HI", "region_type": "State"},
    {"id": "US.FL", "country_id": "US", "name": "Florida", "region_code": "FL", "region_type": "State"},
    {"id": "US.CO", "country_id": "US", "name": "Colorado", "region_code": "CO", "region_type": "State"},

    # France
    {"id": "FR.IDF", "country_id": "FR", "name": "Île-de-France", "region_code": "IDF", "region_type": "Region"},
    {"id": "FR.PAC", "country_id": "FR", "name": "Provence-Alpes-Côte d'Azur", "region_code": "PAC", "region_type": "Region"},
    {"id": "FR.ARA", "country_id": "FR", "name": "Auvergne-Rhône-Alpes", "region_code": "ARA", "region_type": "Region"},

    # Italy
    {"id": "IT.LAZ", "country_id": "IT", "name": "Lazio", "region_code": "62", "region_type": "Region"},
    {"id": "IT.TOS", "country_id": "IT", "name": "Tuscany", "region_code": "52", "region_type": "Region"},
    {"id": "IT.CAM", "country_id": "IT", "name": "Campania", "region_code": "72", "region_type": "Region"},
    {"id": "IT.VEN", "country_id": "IT", "name": "Veneto", "region_code": "34", "region_type": "Region"},

    # Switzerland
    {"id": "CH.BE", "country_id": "CH", "name": "Bern", "region_code": "BE", "region_type": "Canton"},
    {"id": "CH.ZH", "country_id": "CH", "name": "Zurich", "region_code": "ZH", "region_type": "Canton"},
    {"id": "CH.VS", "country_id": "CH", "name": "Valais", "region_code": "VS", "region_type": "Canton"},

    # Indonesia
    {"id": "ID.BA", "country_id": "ID", "name": "Bali", "region_code": "BA", "region_type": "Province"},
    {"id": "ID.JK", "country_id": "ID", "name": "Jakarta", "region_code": "JK", "region_type": "Special Capital Region"},
    {"id": "ID.YO", "country_id": "ID", "name": "Yogyakarta", "region_code": "YO", "region_type": "Special Region"},

    # Australia
    {"id": "AU.NSW", "country_id": "AU", "name": "New South Wales", "region_code": "NSW", "region_type": "State"},
    {"id": "AU.VIC", "country_id": "AU", "name": "Victoria", "region_code": "VIC", "region_type": "State"},
    {"id": "AU.QLD", "country_id": "AU", "name": "Queensland", "region_code": "QLD", "region_type": "State"},

    # Brazil
    {"id": "BR.RJ", "country_id": "BR", "name": "Rio de Janeiro", "region_code": "RJ", "region_type": "State"},
    {"id": "BR.SP", "country_id": "BR", "name": "São Paulo", "region_code": "SP", "region_type": "State"},
    {"id": "BR.BA", "country_id": "BR", "name": "Bahia", "region_code": "BA", "region_type": "State"},

    # South Africa
    {"id": "ZA.WC", "country_id": "ZA", "name": "Western Cape", "region_code": "WC", "region_type": "Province"},
    {"id": "ZA.GP", "country_id": "ZA", "name": "Gauteng", "region_code": "GP", "region_type": "Province"},
]

# POPULATED PLACES (Cities, Towns, Villages, Settlements)
LOCATIONS_SEED = [
    # INDIA - Cities & Hill Station Villages
    {
        "id": "loc-in-munnar", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Munnar", "normalized_name": "munnar", "location_type": "town",
        "latitude": 10.0889, "longitude": 77.0595, "population": 32000,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1263776"
    },
    {
        "id": "loc-in-kochi", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Kochi", "normalized_name": "kochi", "location_type": "city",
        "latitude": 9.9312, "longitude": 76.2673, "population": 602046,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1273874"
    },
    {
        "id": "loc-in-alleppey", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Alappuzha (Alleppey)", "normalized_name": "alappuzha alleppey", "location_type": "city",
        "latitude": 9.4981, "longitude": 76.3388, "population": 174164,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1278917"
    },
    {
        "id": "loc-in-mararikulam", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Mararikulam", "normalized_name": "mararikulam", "location_type": "village",
        "latitude": 9.6000, "longitude": 76.3000, "population": 42000,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1263889"
    },
    {
        "id": "loc-in-kumarakom", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Kumarakom", "normalized_name": "kumarakom", "location_type": "village",
        "latitude": 9.6175, "longitude": 76.4301, "population": 23000,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1265882"
    },
    {
        "id": "loc-in-varkala", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Varkala", "normalized_name": "varkala", "location_type": "town",
        "latitude": 8.7379, "longitude": 76.7163, "population": 40048,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1253457"
    },
    {
        "id": "loc-in-thekkady", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Thekkady", "normalized_name": "thekkady", "location_type": "settlement",
        "latitude": 9.6031, "longitude": 77.1615, "population": 15000,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1254341"
    },
    {
        "id": "loc-in-wayanad", "country_id": "IN", "administrative_region_id": "IN.KL",
        "name": "Kalpetta (Wayanad)", "normalized_name": "kalpetta wayanad", "location_type": "town",
        "latitude": 11.6050, "longitude": 76.0830, "population": 31526,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1267802"
    },
    {
        "id": "loc-in-ooty", "country_id": "IN", "administrative_region_id": "IN.TN",
        "name": "Ooty (Udhagamandalam)", "normalized_name": "ooty udhagamandalam", "location_type": "town",
        "latitude": 11.4102, "longitude": 76.6950, "population": 88430,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1259500"
    },
    {
        "id": "loc-in-kodaikanal", "country_id": "IN", "administrative_region_id": "IN.TN",
        "name": "Kodaikanal", "normalized_name": "kodaikanal", "location_type": "town",
        "latitude": 10.2381, "longitude": 77.4892, "population": 36501,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1266205"
    },
    {
        "id": "loc-in-bengaluru", "country_id": "IN", "administrative_region_id": "IN.KA",
        "name": "Bengaluru (Bangalore)", "normalized_name": "bengaluru bangalore", "location_type": "city",
        "latitude": 12.9716, "longitude": 77.5946, "population": 8443675,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1277333"
    },
    {
        "id": "loc-in-coorg", "country_id": "IN", "administrative_region_id": "IN.KA",
        "name": "Madikeri (Coorg)", "normalized_name": "madikeri coorg", "location_type": "town",
        "latitude": 12.4244, "longitude": 75.7382, "population": 32286,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1264350"
    },
    {
        "id": "loc-in-jaipur", "country_id": "IN", "administrative_region_id": "IN.RJ",
        "name": "Jaipur", "normalized_name": "jaipur", "location_type": "city",
        "latitude": 26.9124, "longitude": 75.7873, "population": 3073350,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1269515"
    },
    {
        "id": "loc-in-goa", "country_id": "IN", "administrative_region_id": "IN.GA",
        "name": "Panaji (Goa)", "normalized_name": "panaji goa", "location_type": "city",
        "latitude": 15.4909, "longitude": 73.8278, "population": 114405,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1260424"
    },
    {
        "id": "loc-in-palolem", "country_id": "IN", "administrative_region_id": "IN.GA",
        "name": "Palolem", "normalized_name": "palolem", "location_type": "village",
        "latitude": 15.0100, "longitude": 74.0232, "population": 4500,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1259981"
    },
    {
        "id": "loc-in-rishikesh", "country_id": "IN", "administrative_region_id": "IN.UT",
        "name": "Rishikesh", "normalized_name": "rishikesh", "location_type": "town",
        "latitude": 30.0869, "longitude": 78.2676, "population": 102138,
        "timezone": "Asia/Kolkata", "data_source": "GeoNames", "external_source_id": "1258338"
    },

    # JAPAN
    {
        "id": "loc-jp-kyoto", "country_id": "JP", "administrative_region_id": "JP.26",
        "name": "Kyoto", "normalized_name": "kyoto", "location_type": "city",
        "latitude": 35.0116, "longitude": 135.7681, "population": 1475183,
        "timezone": "Asia/Tokyo", "data_source": "GeoNames", "external_source_id": "1857910"
    },
    {
        "id": "loc-jp-shirakawago", "country_id": "JP", "administrative_region_id": "JP.26",
        "name": "Shirakawa-go", "normalized_name": "shirakawa go", "location_type": "village",
        "latitude": 36.2562, "longitude": 136.9064, "population": 1600,
        "timezone": "Asia/Tokyo", "data_source": "GeoNames", "external_source_id": "1852924"
    },
    {
        "id": "loc-jp-tokyo", "country_id": "JP", "administrative_region_id": "JP.13",
        "name": "Tokyo", "normalized_name": "tokyo", "location_type": "city",
        "latitude": 35.6762, "longitude": 139.6503, "population": 9733276,
        "timezone": "Asia/Tokyo", "data_source": "GeoNames", "external_source_id": "1850147"
    },
    {
        "id": "loc-jp-hakone", "country_id": "JP", "administrative_region_id": "JP.13",
        "name": "Hakone", "normalized_name": "hakone", "location_type": "town",
        "latitude": 35.2323, "longitude": 139.1069, "population": 13491,
        "timezone": "Asia/Tokyo", "data_source": "GeoNames", "external_source_id": "1863581"
    },

    # INDONESIA
    {
        "id": "loc-id-ubud", "country_id": "ID", "administrative_region_id": "ID.BA",
        "name": "Ubud", "normalized_name": "ubud", "location_type": "town",
        "latitude": -8.5069, "longitude": 115.2625, "population": 74320,
        "timezone": "Asia/Makassar", "data_source": "GeoNames", "external_source_id": "1622807"
    },
    {
        "id": "loc-id-canggu", "country_id": "ID", "administrative_region_id": "ID.BA",
        "name": "Canggu", "normalized_name": "canggu", "location_type": "village",
        "latitude": -8.6500, "longitude": 115.1333, "population": 5000,
        "timezone": "Asia/Makassar", "data_source": "GeoNames", "external_source_id": "1647413"
    },
    {
        "id": "loc-id-denpasar", "country_id": "ID", "administrative_region_id": "ID.BA",
        "name": "Denpasar", "normalized_name": "denpasar", "location_type": "city",
        "latitude": -8.6705, "longitude": 115.2126, "population": 834881,
        "timezone": "Asia/Makassar", "data_source": "GeoNames", "external_source_id": "1645528"
    },

    # SWITZERLAND
    {
        "id": "loc-ch-interlaken", "country_id": "CH", "administrative_region_id": "CH.BE",
        "name": "Interlaken", "normalized_name": "interlaken", "location_type": "town",
        "latitude": 46.6863, "longitude": 7.8632, "population": 5610,
        "timezone": "Europe/Zurich", "data_source": "GeoNames", "external_source_id": "2660253"
    },
    {
        "id": "loc-ch-grindelwald", "country_id": "CH", "administrative_region_id": "CH.BE",
        "name": "Grindelwald", "normalized_name": "grindelwald", "location_type": "village",
        "latitude": 46.6242, "longitude": 8.0414, "population": 3800,
        "timezone": "Europe/Zurich", "data_source": "GeoNames", "external_source_id": "2660724"
    },
    {
        "id": "loc-ch-lauterbrunnen", "country_id": "CH", "administrative_region_id": "CH.BE",
        "name": "Lauterbrunnen", "normalized_name": "lauterbrunnen", "location_type": "village",
        "latitude": 46.5935, "longitude": 7.9077, "population": 2300,
        "timezone": "Europe/Zurich", "data_source": "GeoNames", "external_source_id": "2659993"
    },
    {
        "id": "loc-ch-zermatt", "country_id": "CH", "administrative_region_id": "CH.VS",
        "name": "Zermatt", "normalized_name": "zermatt", "location_type": "town",
        "latitude": 45.9765, "longitude": 7.7491, "population": 5800,
        "timezone": "Europe/Zurich", "data_source": "GeoNames", "external_source_id": "2657928"
    },

    # ITALY
    {
        "id": "loc-it-rome", "country_id": "IT", "administrative_region_id": "IT.LAZ",
        "name": "Rome", "normalized_name": "rome", "location_type": "city",
        "latitude": 41.9028, "longitude": 12.4964, "population": 2872800,
        "timezone": "Europe/Rome", "data_source": "GeoNames", "external_source_id": "3169070"
    },
    {
        "id": "loc-it-positano", "country_id": "IT", "administrative_region_id": "IT.CAM",
        "name": "Positano", "normalized_name": "positano", "location_type": "village",
        "latitude": 40.6281, "longitude": 14.4850, "population": 3950,
        "timezone": "Europe/Rome", "data_source": "GeoNames", "external_source_id": "3170701"
    },
    {
        "id": "loc-it-amalfi", "country_id": "IT", "administrative_region_id": "IT.CAM",
        "name": "Amalfi", "normalized_name": "amalfi", "location_type": "town",
        "latitude": 40.6340, "longitude": 14.6027, "population": 5100,
        "timezone": "Europe/Rome", "data_source": "GeoNames", "external_source_id": "3182897"
    },
    {
        "id": "loc-it-florence", "country_id": "IT", "administrative_region_id": "IT.TOS",
        "name": "Florence", "normalized_name": "florence", "location_type": "city",
        "latitude": 43.7696, "longitude": 11.2558, "population": 382258,
        "timezone": "Europe/Rome", "data_source": "GeoNames", "external_source_id": "3176959"
    },

    # FRANCE
    {
        "id": "loc-fr-paris", "country_id": "FR", "administrative_region_id": "FR.IDF",
        "name": "Paris", "normalized_name": "paris", "location_type": "city",
        "latitude": 48.8566, "longitude": 2.3522, "population": 2161000,
        "timezone": "Europe/Paris", "data_source": "GeoNames", "external_source_id": "2988507"
    },
    {
        "id": "loc-fr-nice", "country_id": "FR", "administrative_region_id": "FR.PAC",
        "name": "Nice", "normalized_name": "nice", "location_type": "city",
        "latitude": 43.7102, "longitude": 7.2620, "population": 342669,
        "timezone": "Europe/Paris", "data_source": "GeoNames", "external_source_id": "2990440"
    },
    {
        "id": "loc-fr-gordes", "country_id": "FR", "administrative_region_id": "FR.PAC",
        "name": "Gordes", "normalized_name": "gordes", "location_type": "village",
        "latitude": 43.9125, "longitude": 5.2008, "population": 1700,
        "timezone": "Europe/Paris", "data_source": "GeoNames", "external_source_id": "3015403"
    },
    {
        "id": "loc-fr-chamonix", "country_id": "FR", "administrative_region_id": "FR.ARA",
        "name": "Chamonix-Mont-Blanc", "normalized_name": "chamonix mont blanc", "location_type": "town",
        "latitude": 45.9237, "longitude": 6.8694, "population": 8900,
        "timezone": "Europe/Paris", "data_source": "GeoNames", "external_source_id": "3027301"
    },

    # UNITED STATES
    {
        "id": "loc-us-sf", "country_id": "US", "administrative_region_id": "US.CA",
        "name": "San Francisco", "normalized_name": "san francisco", "location_type": "city",
        "latitude": 37.7749, "longitude": -122.4194, "population": 873965,
        "timezone": "America/Los_Angeles", "data_source": "GeoNames", "external_source_id": "5391959"
    },
    {
        "id": "loc-us-carmel", "country_id": "US", "administrative_region_id": "US.CA",
        "name": "Carmel-by-the-Sea", "normalized_name": "carmel by the sea", "location_type": "village",
        "latitude": 36.5552, "longitude": -121.9233, "population": 3897,
        "timezone": "America/Los_Angeles", "data_source": "GeoNames", "external_source_id": "5334346"
    },
    {
        "id": "loc-us-nyc", "country_id": "US", "administrative_region_id": "US.NY",
        "name": "New York City", "normalized_name": "new york city", "location_type": "city",
        "latitude": 40.7128, "longitude": -74.0060, "population": 8804190,
        "timezone": "America/New_York", "data_source": "GeoNames", "external_source_id": "5128581"
    },
    {
        "id": "loc-us-lahaina", "country_id": "US", "administrative_region_id": "US.HI",
        "name": "Lahaina", "normalized_name": "lahaina", "location_type": "town",
        "latitude": 20.8783, "longitude": -156.6825, "population": 12702,
        "timezone": "Pacific/Honolulu", "data_source": "GeoNames", "external_source_id": "5849996"
    },

    # UNITED KINGDOM
    {
        "id": "loc-gb-london", "country_id": "GB", "administrative_region_id": None,
        "name": "London", "normalized_name": "london", "location_type": "city",
        "latitude": 51.5074, "longitude": -0.1278, "population": 8982000,
        "timezone": "Europe/London", "data_source": "GeoNames", "external_source_id": "2643743"
    },
    {
        "id": "loc-gb-edinburgh", "country_id": "GB", "administrative_region_id": None,
        "name": "Edinburgh", "normalized_name": "edinburgh", "location_type": "city",
        "latitude": 55.9533, "longitude": -3.1883, "population": 527620,
        "timezone": "Europe/London", "data_source": "GeoNames", "external_source_id": "2650225"
    },
    {
        "id": "loc-gb-bibury", "country_id": "GB", "administrative_region_id": None,
        "name": "Bibury (Cotswolds)", "normalized_name": "bibury cotswolds", "location_type": "village",
        "latitude": 51.7583, "longitude": -1.8319, "population": 627,
        "timezone": "Europe/London", "data_source": "GeoNames", "external_source_id": "2655519"
    },

    # AUSTRALIA
    {
        "id": "loc-au-sydney", "country_id": "AU", "administrative_region_id": "AU.NSW",
        "name": "Sydney", "normalized_name": "sydney", "location_type": "city",
        "latitude": -33.8688, "longitude": 151.2093, "population": 5312163,
        "timezone": "Australia/Sydney", "data_source": "GeoNames", "external_source_id": "2147714"
    },
    {
        "id": "loc-au-byronbay", "country_id": "AU", "administrative_region_id": "AU.NSW",
        "name": "Byron Bay", "normalized_name": "byron bay", "location_type": "town",
        "latitude": -28.6474, "longitude": 153.6120, "population": 9246,
        "timezone": "Australia/Sydney", "data_source": "GeoNames", "external_source_id": "2172880"
    },

    # SOUTH AFRICA
    {
        "id": "loc-za-capetown", "country_id": "ZA", "administrative_region_id": "ZA.WC",
        "name": "Cape Town", "normalized_name": "cape town", "location_type": "city",
        "latitude": -33.9249, "longitude": 18.4241, "population": 433688,
        "timezone": "Africa/Johannesburg", "data_source": "GeoNames", "external_source_id": "3369157"
    },
    {
        "id": "loc-za-franschhoek", "country_id": "ZA", "administrative_region_id": "ZA.WC",
        "name": "Franschhoek", "normalized_name": "franschhoek", "location_type": "village",
        "latitude": -33.9100, "longitude": 19.1230, "population": 17556,
        "timezone": "Africa/Johannesburg", "data_source": "GeoNames", "external_source_id": "3367746"
    },
]

# TRAVEL DESTINATIONS SEED
DESTINATIONS_SEED = [
    {
        "id": "dest-munnar", "location_id": "loc-in-munnar", "destination_name": "Munnar Tea Highlands",
        "description": "Emerald rolling hills, world-renowned tea gardens, and mist-veiled Western Ghats peaks.",
        "category": "Hill Station", "best_visit_season": "October to March", "estimated_visit_duration": "3-4 days",
        "image_url": "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-kyoto", "location_id": "loc-jp-kyoto", "destination_name": "Kyoto Imperial Pavilions",
        "description": "Centuries of Zen gardens, golden pavilions, and thousand vermilion torii gates at Fushimi Inari.",
        "category": "Culture", "best_visit_season": "March to May, October to November", "estimated_visit_duration": "4-5 days",
        "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-ubud", "location_id": "loc-id-ubud", "destination_name": "Ubud & Tegallalang",
        "description": "Spiritual heart of Bali with emerald stepped rice terraces, ancient water temples, and artisan markets.",
        "category": "Tropical", "best_visit_season": "April to October", "estimated_visit_duration": "3-5 days",
        "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-interlaken", "location_id": "loc-ch-interlaken", "destination_name": "Interlaken & Jungfrau Alps",
        "description": "Glacial lakes, snow-capped alpine summits, and Europe's highest cogwheel railway station.",
        "category": "Mountains", "best_visit_season": "June to September, December to March", "estimated_visit_duration": "4-6 days",
        "image_url": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-amalfi", "location_id": "loc-it-amalfi", "destination_name": "Amalfi Coast & Positano",
        "description": "Dramatic pastel cliffside villages towering above turquoise Mediterranean waters and fragrant lemon groves.",
        "category": "Coastal", "best_visit_season": "May to September", "estimated_visit_duration": "3-5 days",
        "image_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-jaipur", "location_id": "loc-in-jaipur", "destination_name": "Jaipur Pink City & Forts",
        "description": "Sandstone fortresses, intricate palace facades, and royal astronomy observatories of Rajasthan.",
        "category": "Heritage", "best_visit_season": "November to February", "estimated_visit_duration": "2-3 days",
        "image_url": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-shirakawago", "location_id": "loc-jp-shirakawago", "destination_name": "Shirakawa-go Historic Village",
        "description": "UNESCO World Heritage thatched gassho-zukuri farmhouses nestled in misty mountain valleys.",
        "category": "Heritage", "best_visit_season": "December to February, May to October", "estimated_visit_duration": "1-2 days",
        "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
    {
        "id": "dest-bibury", "location_id": "loc-gb-bibury", "destination_name": "Bibury & Cotswold Villages",
        "description": "Quintessential honey-colored stone cottages along Arlington Row and pastoral river meadows.",
        "category": "Heritage", "best_visit_season": "May to September", "estimated_visit_duration": "1-2 days",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80",
        "verified_status": True, "source": "GeoNames/OSM"
    },
]
