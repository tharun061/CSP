// ==============================================================================
// GramaSeva Official Service Catalog - Government of Andhra Pradesh
// Standard Basic Home Visit Fee: Strictly ₹50 across all services
// Additional Work Charges: Diagnosed on-site & uploaded upon job completion
// ==============================================================================

export const servicesData = [
  {
    id: 'srv-01',
    slug: 'electrician',
    name_en: 'Electrician Services',
    name_te: 'ఎలక్ట్రీషియన్ సేవలు',
    category: 'Electrical & Power',
    icon: 'Zap',
    base_visit_fee: 50,
    estimated_work_min: 100,
    estimated_work_max: 450,
    popular: true,
    description_en: 'Household wiring, 3-phase agricultural motor starter repair, switchboard repair, ceiling fan & lighting fitting.',
    description_te: 'గృహ వైరింగ్, వ్యవసాయ మోటార్ స్టార్టర్ బాక్స్ రిపేర్, స్విచ్‌బోర్డు ఫిక్సింగ్, ఫ్యాన్ & లైటింగ్ ఏర్పాటు.',
    common_tasks: [
      '3-Phase Agricultural Motor Starter Box Repair',
      'Main Switchboard, MCB & Fuse Rewiring',
      'Ceiling Fan & Exhaust Fan Installation/Repair',
      'Short Circuit Diagnosis & Power Restoration'
    ]
  },
  {
    id: 'srv-02',
    slug: 'plumber',
    name_en: 'Plumbing & Borewell',
    name_te: 'ప్లంబింగ్ & బోర్ మోటార్లు',
    category: 'Water & Sanitation',
    icon: 'Wrench',
    base_visit_fee: 50,
    estimated_work_min: 100,
    estimated_work_max: 550,
    popular: true,
    description_en: 'Borewell submersible motor plumbing, pipeline joint leaks, overhead tank pipe fitting, bathroom tap & valve repairs.',
    description_te: 'బోరుబావి సబ్‌మెర్సిబుల్ మోటార్ పైపింగ్, పైపులైన్ లీకేజీలు, ఓవర్‌హెడ్ ట్యాంక్ కనెక్షన్లు, ట్యాప్ & వాల్వ్ రిపేర్లు.',
    common_tasks: [
      'Submersible Borewell Motor Delivery Pipe Coupling',
      'PVC & GI Pipe Leakage Welding / Sealing',
      'Overhead Water Tank Ball Valve & Float Switch Fix',
      'Bathroom & Kitchen Taps, Flush & Gate Valves'
    ]
  },
  {
    id: 'srv-03',
    slug: 'agri-machinery',
    name_en: 'Agri Machinery & Sprayers',
    name_te: 'వ్యవసాయ పరికరాలు & స్ప్రేయర్లు',
    category: 'Agriculture & Farm',
    icon: 'Tractor',
    base_visit_fee: 50,
    estimated_work_min: 150,
    estimated_work_max: 700,
    popular: true,
    description_en: 'Tractor alternator & dynamo repair, power pesticide sprayer pump servicing, cultivator blade & rotavator adjustments.',
    description_te: 'ట్రాక్టర్ ఆల్టర్నేటర్ & డైనమో రిపేర్, పురుగుమందుల పవర్ స్ప్రేయర్ సర్వీస్, రోటవేటర్ & కల్టివేటర్ మరమ్మతులు.',
    common_tasks: [
      'Battery & Petrol Engine Power Sprayer Overhaul',
      'Tractor Electrical Wiring & Dynamo Charging Fix',
      'Thresher & Chaff Cutter Belt & Bearing Greasing',
      'Drip Irrigation Filter & Venturi Nozzle Servicing'
    ]
  },
  {
    id: 'srv-04',
    slug: 'vehicle-mechanic',
    name_en: '2 & 4 Wheeler Mechanic',
    name_te: 'ద్విచక్ర & నాలుగు చక్రాల మెకానిక్',
    category: 'Automotive Breakdown',
    icon: 'Bike',
    base_visit_fee: 50,
    estimated_work_min: 100,
    estimated_work_max: 500,
    popular: true,
    description_en: 'Doorstep motorcycle & auto-rickshaw breakdown assistance, carburetor cleaning, puncture & battery jump-start.',
    description_te: 'ఇంటి వద్దకే ద్విచక్ర వాహనం & ఆటో రిపేర్, కార్బ్యురేటర్ క్లీనింగ్, పంక్చర్ & బ్యాటరీ జంప్ స్టార్ట్.',
    common_tasks: [
      'Doorstep Motorcycle Breakdown & Starting Trouble',
      'Tubeless & Tube Tire Puncture Repair',
      'Chain Slack Adjustment, Brake Pad & Cable Replacement',
      'Battery Voltage Check & Jump-Start Assistance'
    ]
  },
  {
    id: 'srv-05',
    slug: 'ro-water-purifier',
    name_en: 'RO Water Purifier Service',
    name_te: 'RO వాటర్ ప్యూరిఫైయర్ సర్వీస్',
    category: 'Appliances & Health',
    icon: 'Droplets',
    base_visit_fee: 50,
    estimated_work_min: 150,
    estimated_work_max: 600,
    popular: false,
    description_en: 'RO filter candle replacement, booster pump pressure check, TDS calibration, membrane descaling and leakage repair.',
    description_te: 'RO ఫిల్టర్ క్యాండిల్ మార్పిడి, బూస్టర్ పంప్ ప్రెజర్ చెక్, TDS సర్దుబాటు, మెంబ్రేన్ డీస్కేలింగ్ & లీకేజీ రిపేర్.',
    common_tasks: [
      'Pre-filter Sediment & Carbon Candle Replacement',
      'RO Booster Pump & SMPS Adapter Fault Diagnosis',
      'Water TDS Level Calibration & Taste Tuning',
      'Internal Tube Connector Leakage Stopping'
    ]
  },
  {
    id: 'srv-06',
    slug: 'home-appliances',
    name_en: 'Appliances & Refrigerator',
    name_te: 'గృహోపకరణాలు & రిఫ్రిజిరేటర్',
    category: 'Home Appliances',
    icon: 'Refrigerator',
    base_visit_fee: 50,
    estimated_work_min: 200,
    estimated_work_max: 750,
    popular: false,
    description_en: 'Single & double door refrigerator cooling repair, washing machine spinning issues, mixer-grinder coupler & motor repair.',
    description_te: 'ఫ్రిజ్ కూలింగ్ సమస్యలు, వాషింగ్ మెషీన్ స్పిన్ రిపేర్, మిక్సీ బ్లేడ్ కప్లర్ & మోటార్ వైండింగ్ రిపేర్.',
    common_tasks: [
      'Refrigerator Gas Leakage & Compressor Relay Fix',
      'Mixer-Grinder Coupler, Carbon Brush & Jar Bushing',
      'Semi-Automatic Washing Machine Drain & Spin Motor Fix',
      'Ceiling Fan Rewinding & Capacitor Replacement'
    ]
  },
  {
    id: 'srv-07',
    slug: 'solar-rooftop',
    name_en: 'Solar Rooftop & Inverter',
    name_te: 'సోలార్ రూఫ్‌టాప్ & ఇన్వర్టర్',
    category: 'Renewable Energy',
    icon: 'Sun',
    base_visit_fee: 50,
    estimated_work_min: 250,
    estimated_work_max: 850,
    popular: false,
    description_en: 'PM Surya Ghar rooftop solar inspection, battery distilled water top-up, pure sine wave inverter troubleshooting.',
    description_te: 'రూఫ్‌టాప్ సోలార్ ప్యానెల్ చెకప్, ఇన్వర్టర్ బ్యాటరీ డిస్టిల్డ్ వాటర్ టాప్-అప్, ఇన్వర్టర్ సర్క్యూట్ రిపేర్.',
    common_tasks: [
      'Home Inverter PCB Board & Relay Replacement',
      'Tubular Battery Acid Gravity Check & Terminal Cleaning',
      'Rooftop Solar PV Panel Dust Wash & MC4 Connector Fix',
      'Charge Controller & Grid Tie Inverter Monitoring'
    ]
  },
  {
    id: 'srv-08',
    slug: 'tv-digital',
    name_en: 'TV / DTH & Digital Tech',
    name_te: 'టీవీ / డిష్ & డిజిటల్ పరికరాలు',
    category: 'Electronics & Media',
    icon: 'Tv',
    base_visit_fee: 50,
    estimated_work_min: 100,
    estimated_work_max: 400,
    popular: false,
    description_en: 'DTH satellite antenna signal tracking, LED TV wall mounting, HDMI cable routing, local Wi-Fi router setup.',
    description_te: 'డిష్ యాంటెన్నా సిగ్నల్ సెట్టింగ్, LED టీవీ వాల్ మౌంటింగ్, కేబుల్ వైరింగ్, రూటర్ & వై-ఫై కాన్ఫిగరేషన్.',
    common_tasks: [
      'DTH Satellite Dish Signal Meter Calibration',
      'LED/Smart TV Heavy Wall Mount Bracket Installation',
      'Soundbar & Set-Top Box Audio/Video Configuration',
      'Village Broadband Wi-Fi Router Range Configuration'
    ]
  }
];
