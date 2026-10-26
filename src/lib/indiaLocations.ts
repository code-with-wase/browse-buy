// Indian states/UTs with their major cities, used for the checkout dropdowns.
export const INDIAN_STATES: string[] = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Rajahmundry", "Kakinada", "Amaravati", "Anantapur", "Eluru", "Ongole", "Srikakulam", "Vizianagaram", "Kadapa", "Machilipatnam", "Tenali", "Chittoor", "Hindupur", "Proddatur"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Roing", "Changlang", "Namsai", "Seppa"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Diphu", "Goalpara", "Karimganj", "Sivasagar", "Barpeta", "Nalbari"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", "Sasaram", "Hajipur", "Dehri", "Siwan", "Motihari", "Nawada", "Bagaha", "Buxar", "Kishanganj", "Sitamarhi", "Jamalpur", "Jehanabad", "Aurangabad"],
  Chhattisgarh: ["Raipur", "Bhilai Nagar", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Dhamtari", "Ambikapur", "Mahasamund", "Kanker"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Calangute", "Bicholim", "Quepem", "Pernem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Gandhidham", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Porbandar", "Palanpur", "Valsad", "Vapi", "Veraval", "Godhra", "Patan", "Amreli", "Dahod", "Botad"],
  Haryana: ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Sirsa", "Bhiwani", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Palwal", "Rewari", "Hansi", "Narnaul"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", "Kullu", "Una", "Hamirpur", "Bilaspur", "Chamba", "Kangra", "Paonta Sahib", "Sundernagar"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chatra", "Dumka", "Gumla", "Phusro", "Sahibganj", "Jhumri Telaiya", "Chaibasa", "Jamtara", "Lohardaga"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Raichur", "Bidar", "Hassan", "Hosapete", "Udupi", "Bagalkote", "Gadag", "Kolar", "Chitradurga", "Mandya", "Chikkamagaluru", "Karwar", "Kolar Gold Fields"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Pathanamthitta", "Muvattupuzha", "Kasaragod", "Punalur", "Neyyattinkara", "Kanhangad", "Guruvayur", "Thalassery", "Kottakkal", "Payyanur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Narmadapuram", "Sehore", "Betul", "Seoni", "Datia", "Raisen", "Rajgarh", "Dhar", "Panna", "Tikamgarh", "Sidhi", "Umaria", "Shajapur", "Ashoknagar", "Narsinghpur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Chhatrapati Sambhajinagar", "Navi Mumbai", "Solapur", "Vasai-Virar", "Amravati", "Kolhapur", "Nanded", "Sangli", "Malegaon", "Jalgaon", "Akola", "Latur", "Dhule", "Ahilyanagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Bhusawal", "Panvel", "Satara", "Beed", "Yavatmal", "Dharashiv", "Nandurbar", "Wardha", "Udgir", "Hinganghat", "Hingoli", "Kamthi", "Gondia", "Baramati", "Washim", "Buldana"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati", "Kakching", "Jiribam", "Tamenglong", "Chandel"],
  Meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Khliehriat", "Ampati"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Siaha", "Mamit"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Longleng", "Kiphire", "Peren"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Balasore", "Berhampur", "Baripada", "Jeypore", "Angul", "Jharsuguda", "Bolangir", "Bargarh", "Paradip", "Rayagada", "Dhenkanal", "Kendujhar", "Bhadrak", "Nabarangpur", "Koraput", "Brahmapur", "Cuttack Sadar"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Sangrur", "Firozpur", "Kapurthala", "Fazilka", "Gurdaspur", "Rupnagar", "Nabha", "Zira"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Kishangarh", "Baran", "Dhaulpur", "Tonk", "Beawar", "Hanumangarh", "Gangapur City", "Sawai Madhopur", "Churu", "Jhunjhunu", "Banswara", "Chittorgarh", "Nagaur", "Barmer", "Jaisalmer", "Dungarpur", "Sirohi", "Jhalawar", "Bundi", "Pratapgarh", "Dausa", "Karauli", "Rajsamand"],
  Sikkim: ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Rangpo", "Jorethang", "Soreng"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Erode", "Vellore", "Thanjavur", "Dindigul", "Kanchipuram", "Kanyakumari", "Nagercoil", "Cuddalore", "Karur", "Hosur", "Sivakasi", "Ramanathapuram", "Thoothukudi", "Ranipet", "Sivaganga", "Tenkasi", "Pudukkottai", "Udhagamandalam", "Namakkal", "Kumbakonam", "Ambur", "Pollachi", "Tiruvannamalai", "Nagapattinam", "Ariyalur", "Chengalpattu", "Tirupathur", "Mayiladuthurai"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Sangareddy", "Suryapet", "Miryalaguda", "Siddipet", "Jagtial", "Mancherial", "Kothagudem", "Nirmal", "Wanaparthy", "Bhadradri Kothagudem", "Medak", "Vikarabad", "Nagarkurnool", "Jangoan", "Sircilla"],
  Tripura: ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai", "Ambassa", "Kumarghat", "Sabroom"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Ayodhya", "Rampur", "Shahjahanpur", "Farrukhabad", "Mau", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras", "Banda", "Pilibhit", "Barabanki", "Khurja", "Gonda", "Mainpuri", "Lalitpur", "Etah", "Deoria", "Greater Noida", "Vrindavan", "Shamli", "Ballia", "Ghazipur", "Badaun", "Azamgarh", "Basti", "Chandausi", "Akbarpur", "Nagina", "Baraut", "Soron", "Chandausi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Rishikesh", "Rudrapur", "Haldwani", "Kashipur", "Srinagar", "Kotdwar", "Almora", "Pithoragarh", "Nainital", "New Tehri", "Pauri", "Uttarkashi", "Champawat", "Ranikhet", "Joshimath", "Tanakpur", "Kirtinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Chakdaha", "Darjeeling", "Alipurduar", "Purulia", "Jangipur", "Bolpur", "Suri", "Bishnupur", "Cooch Behar", "Kalyani", "Dumdum", "Seronj"],
  Delhi: ["New Delhi", "Dwarka", "Rohini", "Najafgarh", "Narela", "Shahdara", "Karol Bagh", "Saket", "Vasant Kunj", "Pitampura", "Mayur Vihar", "Punjabi Bagh", "Okhla", "Kalkaji", "Civil Lines"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Pulwama", "Sopore", "Kupwara", "Rajouri", "Poonch", "Doda", "Bandipora", "Ganderbal", "Reasi", "Kulgam", "Kishtwar", "Ramban", "Shopian", "Budgam", "Kathua"],
  Ladakh: ["Leh", "Kargil", "Nubra", "Padum"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  Chandigarh: ["Chandigarh"],
  "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Havelock", "Car Nicobar"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu", "Amli", "Naroli"],
  Lakshadweep: ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott"],
};

export function citiesFor(state: string): string[] {
  return CITIES_BY_STATE[state] ?? [];
}
