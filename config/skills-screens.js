
export const skills_config = {
    "screens": [
        {
            "name": "Skills & Experience",
            "title": "Skills Inventory",
            "tagline": "View and edit your skills and experience.",
            "description": "The Skills Inventory is designed to record your technical and transferable skills, your employment interests, and your preferences for employment.\n\nGet started by filling out the form below.",
            "prompt": "Please provide the following information.",
            "version": "1.0",
            "sections": [
                {
                    "id": "skills-experience",
                    "title": "Skills",
                    "fields": [
                        {
                            "id": "skills-experience_equipment_yes-no",
                            "label": "Equipment",
                            "type": "radiogroup",
                            "prompt": "Have you operated heavy equipment?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "skills-experience_construction_yes-no",
                            "label": "Construction",
                            "type": "radiogroup",
                            "prompt": "Have you ever worked in the construction industry?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "skills-experience_gaming_yes-no",
                            "label": "Gaming",
                            "type": "radiogroup",
                            "prompt": "Have you ever worked in the Gaming Industry?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "skills-experience_administration_yes-no",
                            "label": "Administration",
                            "type": "radiogroup",
                            "prompt": "Have you ever worked in administration?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "skills-experience_computer-skills_rating",
                            "label": "Computer Skills",
                            "type": "select",
                            "prompt": "Please rate your computer skills",
                            "options": [
                                { "value": "unskilled", "label": "Unskilled" },
                                { "value": "below average", "label": "Below Average" },
                                { "value": "average", "label": "Average" },
                                { "value": "above average", "label": "Above Average" },
                                { "value": "highly skilled", "label": "Highly Skilled" }
                            ]
                        },
                        {
                            "id": "skills-experience_security_yes-no",
                            "label": "Security",
                            "type": "radiogroup",
                            "prompt": "Have you ever worked in the security Industry?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "skills-experience_mining_yes-no",
                            "label": "Mining",
                            "type": "radiogroup",
                            "prompt": "Have you ever worked at a mine?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "skills-experience_other-skills-experience",
                            "label": "Other",
                            "type": "textarea",
                            "prompt": "List any other skills that you have gained through employment and experience."
                        },
                    ]
                },
                {
                    "id": "designate-trades",
                    "title": "Trades",
                    "fields": [
                        {
                            "id": "skills-experience_trade_yes-no",
                            "label": "Trades",
                            "type": "radiogroup",
                            "prompt": "Have you ever worked in a trade?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "designate-trade-toggles",
                            "label": "Select applicable trades",
                            "type": "toggles",
                            "options": [
                                {
                                    "value": "skills-experience_trades-designate_agricultural-equipment-technician",
                                    "label": "Agricultural Equipment Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_aircraft-maintenance-engineer-technician",
                                    "label": "Aircraft Maintenance Engineer Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_auto-body-and-collision-technician",
                                    "label": "Auto Body And Collision Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_automotive-refinishing-technician",
                                    "label": "Automotive Refinishing Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_automotive-service-technician",
                                    "label": "Automotive Service Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_boilermaker",
                                    "label": "Boilermaker"
                                },
                                {
                                    "value": "skills-experience_trades-designate_boom-truck-operator-a",
                                    "label": "Boom Truck Operator A"
                                },
                                {
                                    "value": "skills-experience_trades-designate_boom-truck-operator-b",
                                    "label": "Boom Truck Operator B"
                                },
                                {
                                    "value": "skills-experience_trades-designate_bricklayer",
                                    "label": "Bricklayer"
                                },
                                {
                                    "value": "skills-experience_trades-designate_cabinetmaker",
                                    "label": "Cabinetmaker"
                                },
                                {
                                    "value": "skills-experience_trades-designate_carpenter",
                                    "label": "Carpenter"
                                },
                                {
                                    "value": "skills-experience_trades-designate_construction-craft-labourer",
                                    "label": "Construction Craft Labourer"
                                },
                                {
                                    "value": "skills-experience_trades-designate_construction-electrician",
                                    "label": "Construction Electrician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_cook",
                                    "label": "Cook"
                                },
                                {
                                    "value": "skills-experience_trades-designate_electronics-assembler",
                                    "label": "Electronics Assembler"
                                },
                                {
                                    "value": "skills-experience_trades-designate_esthetician--nail-technician",
                                    "label": "Esthetician - Nail Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_esthetician--skin-care-technician",
                                    "label": "Esthetician - Skin Care Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_food-and-beverage-person",
                                    "label": "Food And Beverage Person"
                                },
                                {
                                    "value": "skills-experience_trades-designate_framer",
                                    "label": "Framer"
                                },
                                {
                                    "value": "skills-experience_trades-designate_gasfitter",
                                    "label": "Gasfitter"
                                },
                                {
                                    "value": "skills-experience_trades-designate_glazier",
                                    "label": "Glazier"
                                },
                                {
                                    "value": "skills-experience_trades-designate_guest-services-representative",
                                    "label": "Guest Services Representative"
                                },
                                {
                                    "value": "skills-experience_trades-designate_hairstylist",
                                    "label": "Hairstylist"
                                },
                                {
                                    "value": "skills-experience_trades-designate_heavy-duty-equipment-technician",
                                    "label": "Heavy Duty Equipment Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_industrial-mechanic-millwright",
                                    "label": "Industrial Mechanic (millwright)"
                                },
                                {
                                    "value": "skills-experience_trades-designate_instrumentation--control-technician",
                                    "label": "Instrumentation & Control Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_insulator-heat-and-frost",
                                    "label": "Insulator (heat And Frost)"
                                },
                                {
                                    "value": "skills-experience_trades-designate_ironworker-reinforcing",
                                    "label": "Ironworker (reinforcing)"
                                },
                                {
                                    "value": "skills-experience_trades-designate_ironworker-structuralornamental",
                                    "label": "Ironworker (structural/ornamental)"
                                },
                                {
                                    "value": "skills-experience_trades-designate_landscape-horticulturist",
                                    "label": "Landscape Horticulturist"
                                },
                                {
                                    "value": "skills-experience_trades-designate_lather-interior-systems-mechanic",
                                    "label": "Lather (interior Systems Mechanic)"
                                },
                                {
                                    "value": "skills-experience_trades-designate_locksmith",
                                    "label": "Locksmith"
                                },
                                {
                                    "value": "skills-experience_trades-designate_machinist",
                                    "label": "Machinist"
                                },
                                {
                                    "value": "skills-experience_trades-designate_meat-cutter",
                                    "label": "Meat Cutter"
                                },
                                {
                                    "value": "skills-experience_trades-designate_metal-fabricator-fitter",
                                    "label": "Metal Fabricator (fitter)"
                                },
                                {
                                    "value": "skills-experience_trades-designate_mobile-crane-operator",
                                    "label": "Mobile Crane Operator"
                                },
                                {
                                    "value": "skills-experience_trades-designate_painter--decorator",
                                    "label": "Painter & Decorator"
                                },
                                {
                                    "value": "skills-experience_trades-designate_parts-technician",
                                    "label": "Parts Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_petroleum-installer-technician",
                                    "label": "Petroleum Installer Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_plumber",
                                    "label": "Plumber"
                                },
                                {
                                    "value": "skills-experience_trades-designate_powerline-technician",
                                    "label": "Powerline Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_processor",
                                    "label": "Processor"
                                },
                                {
                                    "value": "skills-experience_trades-designate_recreation-vehicle-service-technician",
                                    "label": "Recreation Vehicle Service Technician"
                                },
                                {
                                    "value": "skills-experience_trades-designate_refrigeration--air-conditioning-mechanic",
                                    "label": "Refrigeration & Air Conditioning Mechanic"
                                },
                                {
                                    "value": "skills-experience_trades-designate_roofer",
                                    "label": "Roofer"
                                },
                                {
                                    "value": "skills-experience_trades-designate_scaffolder",
                                    "label": "Scaffolder"
                                },
                                {
                                    "value": "skills-experience_trades-designate_semiautomatic-welding-production-operator",
                                    "label": "Semiautomatic Welding Production Operator"
                                },
                                {
                                    "value": "skills-experience_trades-designate_sheet-metal-worker",
                                    "label": "Sheet Metal Worker"
                                },
                                {
                                    "value": "skills-experience_trades-designate_slaughterer",
                                    "label": "Slaughterer"
                                },
                                {
                                    "value": "skills-experience_trades-designate_sprinkler-fitter",
                                    "label": "Sprinkler Fitter"
                                },
                                {
                                    "value": "skills-experience_trades-designate_steamfitter--pipefitter",
                                    "label": "Steamfitter - Pipefitter"
                                },
                                {
                                    "value": "skills-experience_trades-designate_tilesetter",
                                    "label": "Tilesetter"
                                },
                                {
                                    "value": "skills-experience_trades-designate_tower-crane-operator",
                                    "label": "Tower Crane Operator"
                                },
                                {
                                    "value": "skills-experience_trades-designate_truck--transport-mechanic",
                                    "label": "Truck & Transport Mechanic"
                                },
                                {
                                    "value": "skills-experience_trades-designate_welder",
                                    "label": "Welder"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Education & Training",
            "title": "Skills Inventory",
            "tagline": "View and edit training you have received in various work related areas.",
            "description": "The Skills Inventory is designed to record your technical and transferable skills, your employment interests, and your preferences for employment.\n\nGet started by filling out the form below.",
            "prompt": "Please provide the following information.",
            "version": "1.0",
            "sections": [
                {
                    "id": "education-school",
                    "title": "Education",
                    "fields": [
                        {
                            "id": "skills-experience_computer-skills_rating",
                            "label": "Primary & High School",
                            "type": "select",
                            "prompt": "What is your highest level of primary/high school education?",
                            "options": [
                                { "value": "primary", "label": "Primary School" },
                                { "value": "9", "label": "9" },
                                { "value": "10", "label": "10" },
                                { "value": "11", "label": "11" },
                                { "value": "12", "label": "12" }
                            ]
                        },
                        {
                            "id": "education_ged_yes-no",
                            "type": "radiogroup",
                            "prompt": "If you have Grade 12, was this obtained through Adult Basic Education, GED or other alternate means?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "education_post-secondary_course",
                            "label": "Post Secondary",
                            "type": "dynamic-inputs",
                            "prompt": "List any certificate or diploma courses you have completed.",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        }
                    ]
                },
                {
                    "id": "education-training",
                    "title": "Training",
                    "fields": [
                        {
                            "id": "designate-trade-toggles",
                            "label": "Select applicable Training",
                            "type": "toggles",
                            "options":
                            [
                                { "value": "skill_airbrakes", "label": "Airbrakes" },
                                { "value": "skill_archaeological-technicians", "label": "Archaeological Technicians" },
                                { "value": "skill_basic-accounting", "label": "Basic Accounting" },
                                { "value": "skill_bear-aware", "label": "Bear Aware" },
                                { "value": "skill_chainsaw-safety", "label": "Chainsaw Safety" },
                                { "value": "skill_chartwork-pilotage", "label": "Chartwork & Pilotage" },
                                { "value": "skill_confined-space-entry", "label": "Confined Space Entry" },
                                { "value": "skill_construction-safety", "label": "Construction Safety" },
                                { "value": "skill_crane-operator", "label": "Crane Operator" },
                                { "value": "skill_drilling-safety", "label": "Drill Safety" },
                                { "value": "skill_driller", "label": "Driller" },
                                { "value": "skill_environmental-monitor", "label": "Environmental Monitor" },
                                { "value": "skill_fall-protection", "label": "Fall Protection" },
                                { "value": "skill_fire-safety", "label": "Fire Safety" },
                                { "value": "skill_first-aid-cpr", "label": "First Aid/CPR" },
                                { "value": "skill_first-host-world-host", "label": "First Host/World Host" },
                                { "value": "skill_flagger", "label": "Flagger" },
                                { "value": "skill_food-safety", "label": "Food Safety" },
                                { "value": "skill_forklift", "label": "Forklift" },
                                { "value": "education_grade_12", "label": "Grade 12 Education" },
                                { "value": "skill_ground-disturbance", "label": "Ground Disturbance" },
                                { "value": "skill_h2s-alive", "label": "H2S Alive" },
                                { "value": "skill_heavy-equipment", "label": "Heavy Equipment" },
                                { "value": "skill_heavy-haul", "label": "Heavy Haul" },
                                { "value": "skill_helicopter-safety", "label": "Helicopter Safety" },
                                { "value": "skill_valueboarding", "label": "valueboarding" },
                                { "value": "skill_marine-emergency-duties", "label": "Marine Emergency Duties" },
                                { "value": "skill_microsoft-office", "label": "Microsoft Office" },
                                { "value": "skill_navigation-safety", "label": "Navigation Safety" },
                                { "value": "skill_oh-s", "label": "OH & S" },
                                { "value": "skill_occupational-first-aid-transportation-endorsement", "label": "Occupational First Aid - Transportation Endorsement" },
                                { "value": "skill_pipeline-construction-safety", "label": "Pipeline Construction Safety" },
                                { "value": "education_post_secondary", "label": "Post Secondary Education" },
                                { "value": "skill_prep-cook", "label": "Prep Cook" },
                                { "value": "skill_radio-operator", "label": "Radio Operator" },
                                { "value": "skill_rigging-lifting", "label": "Rigging & Lifting" },
                                { "value": "skill_road-builder-heavy-construction", "label": "Road Builder & Heavy Construction" },
                                { "value": "skill_scaffolding", "label": "Scaffolding" },
                                { "value": "skill_security", "label": "Security" },
                                { "value": "skill_spill-response", "label": "Spill response" },
                                { "value": "skill_supervisor", "label": "Supervisor" },
                                { "value": "skill_transport-dangerous-goods", "label": "Transport of Dangerous Goods" },
                                { "value": "skill_whmis", "label": "WHMIS" },
                                { "value": "skill_wildland-firefighter", "label": "Wildland Firefighter" },
                                { "value": "skill_wildlife-monitor", "label": "Wildlife Monitor" }
                            ]
                        },
                        {
                            "id": "training_other-training_course",
                            "label": "Other Training",
                            "type": "dynamic-inputs",
                            "prompt": "List any other training you have completed.",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "training_future-training",
                            "label": "Furture Training",
                            "prompt": "What kind of training would you like to see offered in the community in the future?",
                            "type": "textarea"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Tickets",
            "sections": [
                {
                    "id": "designate-tickets",
                    "title": "Tickets",
                    "fields": [
                        {
                            "id": "skills-experience_trade_yes-no",
                            "label": "Manage Profile Tickets",
                            "type": "dynamic-inputs",
                            "prompt": "View and edit various ticket accreditations and their expiries",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        }
                    ]
                }
            ]
        }
        ,{
            "name": "Working Conditions",
            "sections": [
                {
                    "id": "designate-tickets",
                    "title": "Working Conditions",
                    "fields": [
                        {
                            "id": "working-conditions_commute_yes",
                            "type": "radiogroup",
                            "label": "Are you able to commute to a work site?",
                            "prompt": "Example: have a vehicle to get to work site; someone to give you a ride",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_rotational-schedule_yes",
                            "type": "radiogroup",
                            "label": "Are you able to work a rotational schedule and live in camp?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_lived-work-camp_yes",
                            "type": "radiogroup",
                            "label": "Have you lived in a work camp setting before?",

                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_nightshifts_yes",
                            "type": "radiogroup",
                            "label": "Are you able to work night shifts?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_drivers-license_yes",
                            "type": "radiogroup",
                            "label": "Do you have a driver's license?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_license-class",
                            "type": "select",
                            "label": "If yes, what class?",
                            "options": [
                                {"value": "None", "label": "None"},
                                {"value": "1", "label": "1"},
                                {"value": "1A", "label": "1A"},
                                {"value": "2", "label": "2"},
                                {"value": "2A", "label": "2A"},
                                {"value": "3", "label": "3"},
                                {"value": "3A", "label": "3A"},
                                {"value": "4", "label": "4"},
                                {"value": "5", "label": "5"},
                                {"value": "7", "label": "7"},
                                {"value": "A", "label": "Class A"},
                                {"value": "B", "label": "Class B"},
                                {"value": "C", "label": "Class C"},
                                {"value": "D", "label": "Class D"},
                                {"value": "E", "label": "Class E"},
                                {"value": "F", "label": "Class F"},
                                {"value": "G", "label": "Class G"},
                                {"value": "H", "label": "Class H"}
                            ]
                        },
                        {
                            "id": "working-conditions_background-check_yes",
                            "type": "radiogroup",
                            "label": "Many companies require a security clearance and/or background check for security purposes. Are you willing to submit to a security clearance and/or background check?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_drug-test_yes",
                            "type": "radiogroup",
                            "label": "Many companies require applicants and employees to participate in drug and alcohol testing. Are you willing to submit to workplace drug and alcohol testing?",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_barriers_yes",
                            "type": "radiogroup",
                            "label": "Are there any barriers you have in gaining and/or maintaining employment?",
                            "prompt": "Example: family commitments, daycare, transportation, nutrition, health",
                            "options": [
                                {"value": "yes", "label": "Yes"},
                                {"value": "no", "label": "No"}
                            ]
                        },
                        {
                            "id": "working-conditions_barriers",
                            "type": "textarea",
                            "label": "If yes, what are the barriers?",
                            "options": []
                        }
                    ]
                }
            ]
        },
        {
            "name": "Employment Experience",
            "sections": [
                {
                      "id": "current-employer",
                      "title": "Current Employer",
                      "fields": [
                            {
                                  "id": "employment_currently-employed",
                                  "type": "radiogroup",
                                  "label": "Are you currently employed?",
                                  "options": [
                                        {"value": "yes", "label": "Yes"},
                                        {"value": "no", "label": "No"}
                                  ]
                            },
                            {
                                  "id": "current-employer_job-title",
                                  "type": "text",
                                  "label": "Job Title",
                                  "options": []
                            },
                            {
                                  "id": "current-employer_company",
                                  "type": "text",
                                  "label": "Company",
                                  "options": []
                            },
                            {
                                  "id": "current-employer_city",
                                  "type": "text",
                                  "label": "City",
                                  "options": []
                            },
                            {
                                  "id": "current-employer_start-month",
                                  "type": "text",
                                  "label": "Start Month",
                                  "options": []
                            },
                            {
                                  "id": "current-employer_start-date",
                                  "type": "text",
                                  "label": "Start Year",
                                  "options": []
                            },
                            {
                                  "id": "current-employer_tasks",
                                  "type": "textarea",
                                  "label": "Tasks",
                                  "options": []
                            }
                      ]
                  },
                  {
                      "id": "past-employer1",
                      "title": "Past Employer",
                      "fields": [
                            {
                                  "id": "past-employer_job-title",
                                  "type": "text",
                                  "label": "Job Title",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_company",
                                  "type": "text",
                                  "label": "Company",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_city",
                                  "type": "text",
                                  "label": "City",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_start-month",
                                  "type": "text",
                                  "label": "Start Month",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_start-date",
                                  "type": "text",
                                  "label": "Start Year",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_end-month",
                                  "type": "text",
                                  "label": "End Month",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_end-date",
                                  "type": "text",
                                  "label": "End Year",
                                  "options": []
                            },
                            {
                                  "id": "past-employer_tasks",
                                  "type": "text",
                                  "label": "Tasks",
                                  "options": []
                            }
                      ]
                },
                {
                    "id": "past-employer2",
                    "title": "Past Employer 2",
                    "fields": [
                            {
                                  "id": "past-employer2_job-title",
                                  "type": "text",
                                  "label": "Job Title",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_company",
                                  "type": "text",
                                  "label": "Company",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_city",
                                  "type": "text",
                                  "label": "City",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_start-month",
                                  "type": "text",
                                  "label": "Start Month",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_start-date",
                                  "type": "text",
                                  "label": "Start Year",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_end-month",
                                  "type": "text",
                                  "label": "End Month",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_end-date",
                                  "type": "text",
                                  "label": "End Year",
                                  "options": []
                            },
                            {
                                  "id": "past-employer2_tasks",
                                  "type": "text",
                                  "label": "Tasks",
                                  "options": []
                            }
                      ]
                },
                {
                    "id": "career-objectives",
                    "title": "Career Objectives",
                    "fields": [
                            {
                                  "id": "resume_objectives",
                                  "type": "textarea",
                                  "label": "Please state your employment/career objective(s):",
                                  "options": []
                            }
                      ]
                },
                {
                    "id": "references1",
                    "title": "Reference #2",
                    "fields": [
                            {
                                  "id": "reference_1_name",
                                  "type": "text",
                                  "label": "Name",
                                  "options": []
                            },
                            {
                                  "id": "reference_1_position",
                                  "type": "text",
                                  "label": "Position",
                                  "options": []
                            },
                            {
                                  "id": "reference_1_employer",
                                  "type": "text",
                                  "label": "Employer",
                                  "options": []
                            },
                            {
                                  "id": "reference_1_phone",
                                  "type": "text",
                                  "label": "Phone",
                                  "options": []
                            },
                            {
                                  "id": "reference_1_email",
                                  "type": "text",
                                  "label": "Email Address",
                                  "options": []
                            }
                      ]
                },
                {
                    "id": "references2",
                    "title": "Reference #2",
                    "fields": [
                            {
                                  "id": "reference_2_name",
                                  "type": "text",
                                  "label": "Name",
                                  "options": []
                            },
                            {
                                  "id": "reference_2_position",
                                  "type": "text",
                                  "label": "Position",
                                  "options": []
                            },
                            {
                                  "id": "reference_2_employer",
                                  "type": "text",
                                  "label": "Employer",
                                  "options": []
                            },
                            {
                                  "id": "reference_2_phone",
                                  "type": "text",
                                  "label": "Phone",
                                  "options": []
                            },
                            {
                                  "id": "reference_2_email",
                                  "type": "text",
                                  "label": "Email Address",
                                  "options": []
                            }
                      ]
                },
                {
                    "id": "references3",
                    "title": "Reference #3",
                    "fields": [
                            {
                                  "id": "reference_3_name",
                                  "type": "text",
                                  "label": "Name",
                                  "options": []
                            },
                            {
                                  "id": "reference_3_position",
                                  "type": "text",
                                  "label": "Position",
                                  "options": []
                            },
                            {
                                  "id": "reference_3_employer",
                                  "type": "text",
                                  "label": "Employer",
                                  "options": []
                            },
                            {
                                  "id": "reference_3_phone",
                                  "type": "text",
                                  "label": "Phone",
                                  "options": []
                            },
                            {
                                  "id": "reference_3_email",
                                  "type": "text",
                                  "label": "Email Address",
                                  "options": []
                            }
                      ]
                }
          ]
        },
        {
            "name": "Interestes & Hobbies",
            "sections": [
                {
                    "id": "interests-hobbies",
                    "title": "Interests & Hobbies",
                    "fields": [
                        {
                              "id": "other_community-leadership",
                              "type": "textarea",
                              "label": "Please indicate any community leadership positions that you have undertaken.",
                              "options": []
                        },
                        {
                              "id": "other_board",
                              "type": "textarea",
                              "label": "Please indicate any board positions that you have undertaken.",
                              "options": []
                        },
                        {
                              "id": "other_volunteer",
                              "type": "textarea",
                              "label": "Please indicate any volunteer activities that you have undertaken.",
                              "options": []
                        },
                        {
                              "id": "other_interests-hobbies",
                              "type": "textarea",
                              "label": "Please indicate any interests or hobbies that you have:",
                              "options": []
                        }
                  ]
                }
            ]
        }
    ]
}