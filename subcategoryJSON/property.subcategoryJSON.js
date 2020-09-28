[
    {subcategory:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"For Rent Houses and Apartments",
        "display_index":0,
        "photo_limit":[{
            "min":"1",
            "max":"50",
        }],
        "card_display_string":"card display",
        "description":"description",
        "sorting_options":[{
            "key":0,
            "name":"ascending",
        },{
            "key":1,
            "name":"descending",
        }],
        "parameters":[{
            "key":"type",
            "name":"type",
            "label":"Type",
            "values":[{
                "key":0,
                "name":"Houses and Villas",
            },
        {
                "key":1,
                "name":"Apartments"
        },{
                "key":2,
                "name":"Builder Floors",
        }],
          "is_required":false,
            "error_msg":"Type is required"
        },
    {
            "key":"bedrooms",
            "name":"bedrooms",
            "label":"Bed Rooms",
            "display_index":1,
            "control_type":"BUTTON_LIST",
            "values":[{
                "key":0,
                "name":"1",
            },
        {
                "key":1,
                "name":"2",
        },
    {
                "key":2,
                "name":"3",
    },
        {
                "key":3,
                "name":"4",
        },
        {
                "key":4,
                "name":"4+",
        }],
      "is_required":false,
        "error_msg":"Please select Bedrooms",
    },
    {
        "key":"bathrooms",
        "name":"bathrooms",
        "label":"Bath Rooms",
        "display_index":2,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"4",
    },
    {
            "key":4,
            "name":"4+",
    }],
  "is_required":false,
    "error_msg":"Please select Bathrooms", 
    },
    {
        "key":"furnishing",
        "name":"furnishing",
        "label":"Furnishing",
        "display_index":3,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Furnished",
        },
    {
            "key":1,
            "name":"Unfurnished",
    },
{
            "key":2,
            "name":"Semi-Furnished",
}],
  "is_required":false,
    "error_msg":"Please select Furnishing",
    },   
    {
        "key":"listedby",
        "name":"listedby",
        "label":"Listed By",
        "display_index":4,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Owner",
        },
    {
            "key":1,
            "name":"Dealer",
    },
{
            "key":2,
            "name":"Builder",
}],
  "is_required":false,
    "error_msg":"Please select Listed By",
    },
    {
        "key":"superbuiltuparea",
        "name":"superbuiltuparea",
        "label":"Super Builtup Area(ft2)",
        "display_index":5,
        "control_type":"NUMBER", 
        "is_required":false,
        "error_msg":"Please enter super builtup area",
        "min":1,
        "max":1000,
    },
    {
        "key":"carpetarea",
        "name":"carpetarea",
        "label":"Carpet Area(ft2)",
        "display_index":6,
        "control_type":"NUMBER", 
        "is_required":true,
        "error_msg":"Please enter carpet area ",
        "min":1,
        "max":1000,
    },
    {
        "key":"bachelorsAllowed",
        "name":"bachelorsAllowed",
        "label":"Bachelors Allowed",
        "display_index":7,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Yes",
        },
    {
            "key":1,
            "name":"No",
    }],
    "is_required":false,
    "error_msg":"Please select bachelors allowed",
    },
    
    {
        "key":"maintenance",
        "name":"maintenance",
        "label":"Maintenence (Monthly)",
        "display_index":8,
        "control_type":"NUMBER",
 
      "is_required":false,
        "error_msg":"Please enter monthly maintenance",
        "min":1,
        "max":1000,
    },
    {
        "key":"totalfloors",
        "name":"totalfloors",
        "label":"Total Floors",
        "display_index":9,
        "control_type":"NUMBER", 
        "is_required":false,
        "error_msg":"Please enter total floors",
        "min":1,
        "max":100,
    },
    {
        "key":"floornumber",
        "name":"floornumber",
        "label":"Floor Number",
        "display_index":10,
        "control_type":"NUMBER", 
        "is_required":false,
        "error_msg":"Please enter floor number",
        "min":1,
        "max":100,
    },
    {
        "key":"carparking",
        "name":"carparking",
        "label":"Car Parking",
        "display_index":11,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"3+",
    }], 
      "is_required":false,
        "error_msg":"Please select car parking",
    },
    {
        "key":"facing",
        "name":"facing",
        "label":"Facing",
        "display_index":12,
        "control_type":"SELECT",
        "values":[{
            "key":0,
            "name":"East",
        },
    {
            "key":1,
            "name":"North",
    },
{
            "key":2,
            "name":"North-East",
},
    {
            "key":3,
            "name":"North-West",
    },
    {
            "key":4,
            "name":"South",
    },
    {
            "key":5,
            "name":"South-East",
    },
    {
            "key":6,
            "name":"South-West",
    },
    {
            "key":7,
            "name":"West",
    }],
      "is_required":false,
        "error_msg":"Please select Facing",
    },
    {
        "key":"project name",
        "name":"project name",
        "label":"Project name",
        "display_index":13,
        "control_type":"TEXT",
 
      "is_required":false,
        "error_msg":"Please enter project name",
        "min":1,
        "max":100,
    },
    {
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":14,
        "control_type":"TEXT",
 
        "is_required":true,
        "error_msg":"Please enter ad title",
        "min":10,
        "max":100,
    },
    {
        "key":"description",
        "name":"description",
        "label":"Description",
        "display_index":15,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
 }
},
{
    subcategory:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"For Sale Houses and Apartments",
        "display_index":1,
        photo_limit:[{
            "min":"1",
            "max":"50",
        }],
        card_display_string:"card display",
        description:"description",
        sorting_options:[{
            "key":0,
            "name":"ascending",
        },{
            "key":1,
            "name":"descending",
        }],
        parameters:[{
            "key":"type",
            "name":"type",
            "label":"type",
            "values":[{
                "key":0,
                "name":"Houses and Villas",
            },
        {
                "key":1,
                "name":"Apartments"
        },{
                "key":2,
                "name":"Builder Floors",
        },{
                "key":3,
                "name":"Farm Houses",
        }],
          "is_required":false,
            "error_msg":"Type is required"
        },
    {
            "key":"bedrooms",
            "name":"bedrooms",
            "label":"Bed Rooms",
            "display_index":1,
            "control_type":"BUTTON_LiST",
            "values":[{
                "key":0,
                "name":"1",
            },
        {
                "key":1,
                "name":"2",
        },
    {
                "key":2,
                "name":"3",
    },
        {
                "key":3,
                "name":"4",
        },
        {
                "key":4,
                "name":"4+",
        }],
      "is_required":true,
        "error_msg":"Please select Bedrooms",
    },
    {
        "key":"bathrooms",
        "name":"bathrooms",
        "label":"Bath Rooms",
        "display_index":2,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"4",
    },
    {
            "key":4,
            "name":"4+",
    }],
  "is_required":false,
    "error_msg":"Please select Bathrooms", 
    },
    {
        "key":"furnishing",
        "name":"furnishing",
        "label":"Furnishing",
        "display_index":3,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"Furnished",
        },
    {
            "key":1,
            "name":"Unfurnished",
    },
{
            "key":2,
            "name":"SemiFurnished",
}],
  "is_required":false,
    "error_msg":"Please select Furnishing",
    },
    {
        "key":"construction_status",
        "name":"construction_status",
        "label":"Construction Status",
        "display_index":4,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"Under Construction",
        },
    {
            "key":1,
            "name":"Ready to Move",
    },
{
            "key":2,
            "name":"New Launch",
}],
  "is_required":false,
    "error_msg":"Please select Construction Status",
    },
    {
        "key":"listedby",
        "name":"listedby",
        "label":"Listed By",
        "display_index":5,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"Owner",
        },
    {
            "key":1,
            "name":"Dealer",
    },
{
            "key":2,
            "name":"Builder",
}],
  "is_required":false,
    "error_msg":"Please select Listed By",
    },
    {
        "key":"superbuiltuparea",
        "name":"superbuiltuparea",
        "label":"Super Builtup Area(ft2)",
        "display_index":6,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter super builtup area",
        "min":1,
        "max":1000,
    },
    {
        "key":"carpetarea",
        "name":"carpetarea",
        "label":"Carpet Area(ft2)",
        "display_index":7,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter carpet area ",
        "min":1,
        "max":1000,
    },{
        "key":"maintenance",
        "name":"maintenance",
        "label":"Maintenence(Monthly)",
        "display_index":8,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter monthly maintenance",
        "min":1,
        "max":1000,
    },
    {
        "key":"total floors",
        "name":"total floors",
        "label":"Total Floors",
        "display_index":9,
        "control_type":"NUMBER",
 
      "is_required":false,
        "error_msg":"Please enter total floors",
        "min":1,
        "max":100,
    },
    {
        "key":"floornumber",
        "name":"floornumber",
        "label":"Floor Number",
        "display_index":10,
        "control_type":"NUMBER",
 
      "is_required":false,
        "error_msg":"Please enter floor number",
        "min":1,
        "max":100,
    },
    {
        "key":"carparking",
        "name":"carparking",
        "label":"Car Parking",
        "display_index":11,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"4",
    },
    {
            "key":4,
            "name":"4+",
    }],
 
      "is_required":false,
        "error_msg":"Please select car parking",
    },
    {
        "key":"facing",
        "name":"facing",
        "label":"Facing",
        "display_index":12,
        "control_type":"SELECT",
        "values":[{
            "key":0,
            "name":"East",
        },
    {
            "key":1,
            "name":"North",
    },
{
            "key":2,
            "name":"North-East",
},
    {
            "key":3,
            "name":"North-West",
    },
    {
            "key":4,
            "name":"South",
    },
    {
            "key":5,
            "name":"South-East",
    },
    {
            "key":6,
            "name":"South-West",
    },
    {
            "key":7,
            "name":"West",
    }],
      "is_required":false,
        "error_msg":"Please select Facing",
    },
    {
        "key":"project"name"",
        "name":"project"name"",
        "label":"Project "name"",
        "display_index":13,
        "control_type":"TEXT",
 
      "is_required":false,
        "error_msg":"Please enter project "name"",
        "min":1,
        "max":100,
    },
    {
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":14,
        "control_type":"TEXT",
 
      "is_required":true,
        "error_msg":"Please enter ad title",
        "min":10,
        "max":100,
    },
    {
        "key":"description",
        "name":"description",
        "label":"Description",
        "display_index":15,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
 }  
},
{
    subcategory:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"Lands and Plots",
        "display_index":2,
        photo_limit:[{
            "min":"1",
            "max":"50",
        }],
        card_display_string:"card display",
        description:"description",
        sorting_options:[{
            "key":0,
            "name":"ascending",
        },{
            "key":1,
            "name":"descending",
        }],
        parameters:[{
            "key":"type",
            "name":"type",
            "label":"type",
            "values":[{
                "key":0,
                "name":"For Rent",
            },
        {
                "key":1,
                "name":"For Sale"
        }],
          "is_required":false,
            "error_msg":"Type is required",
        },
    {
        "key":"listedby",
        "name":"listedby",
        "label":"Listed By",
        "display_index":1,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Owner",
        },
    {
            "key":1,
            "name":"Dealer",
    },
{
            "key":2,
            "name":"Builder",
}],
  "is_required":false,
    "error_msg":"Please select Listed By",
    },
    {
        "key":"plotarea",
        "name":"plotarea",
        "label":"Plot Area (ft2)",
        "display_index":2,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter plot area",
        "min":1,
        "max":1000,
    },
  ,{
        "key":"length",
        "name":"length",
        "label":"Length (ft2)",
        "display_index":3,
        "control_type":"NUMBER",
 
      "is_required":false,
        "error_msg":"Please enter length",
        "min":1,
        "max":10000,  
    },
    {
        "key":"breadth",
        "name":"breadth",
        "label":"Breadth (ft2)",
        "display_index":4,
        "control_type":"NUMBER", 
        "is_required":false,
        "error_msg":"Please enter breadth",
        "min":1,
        "max":10000,  
    },
    {
        "key":"facing",
        "name":"facing",
        "label":"Facing",
        "display_index":5,
        "control_type":"SELECT",
        "values":[{
            "key":0,
            "name":"East",
        },
    {
            "key":1,
            "name":"North",
    },
{
            "key":2,
            "name":"North-East",
},
    {
            "key":3,
            "name":"North-West",
    },
    {
            "key":4,
            "name":"South",
    },
    {
            "key":5,
            "name":"South-East",
    },
    {
            "key":6,
            "name":"South-West",
    },
    {
            "key":7,
            "name":"West",
    }],
      "is_required":false,
        "error_msg":"Please select Facing",
    },
    {
        "key":"projectname",
        "name":"projectname",
        "label":"Project name",
        "display_index":6,
        "control_type":"TEXT",
 
      "is_required":false,
        "error_msg":"Please enter project name",
        "min":1,
        "max":100,
    },
    {
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":7,
        "control_type":"TEXT",
 
      "is_required":true,
        "error_msg":"Please enter ad title",
        "min":10,
        "max":100,
    },
    {
        "key":"description",
        "name":"description",
        "label":"Description",
        "display_index":8,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
 }
},
{
    subcategory:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"For Rent Shops and offices",
        "display_index":3,
        photo_limit:[{
            "min":"1",
            "max":"50",
        }],
        card_display_string:"card display",
        description:"description",
        sorting_options:[{
            "key":0,
            "name":"ascending",
        },{
            "key":1,
            "name":"descending",
        }],
        parameters:[
    {
        "key":"furnishing",
        "name":"furnishing",
        "label":"Furnishing",
        "display_index":0,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Furnished",
        },
    {
            "key":1,
            "name":"Unfurnished",
    },
{
            "key":2,
            "name":"Semi-Furnished",
}],
  "is_required":false,
    "error_msg":"Please select Furnishing",
    },
    {
        "key":"listedby",
        "name":"listedby",
        "label":"Listed By",
        "display_index":1,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Owner",
        },
    {
            "key":1,
            "name":"Dealer",
    },
{
            "key":2,
            "name":"Builder",
}],
  "is_required":false,
    "error_msg":"Please select Listed By",
    },
    {
        "key":"superbuiltuparea",
        "name":"superbuiltuparea",
        "label":"Super Builtup area(ft2)",
        "display_index":2,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter super builtup area",
        "min":1,
        "max":1000,
    },
    {
        "key":"carpetarea",
        "name":"carpetarea",
        "label":"Carpet Area (ft2)",
        "display_index":3,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter carpet area ",
        "min":1,
        "max":1000,
    },
    {
        "key":"maintenance",
        "name":"maintenance",
        "label":"Maintenence (Monthly)",
        "display_index":4,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter monthly maintenance",
        "min":1,
        "max":1000,
    },

    {
        "key":"carparking",
        "name":"carparking",
        "label":"Car Parking",
        "display_index":5,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"4",
    },
    {
            "key":4,
            "name":"4+",
    }],
 
      "is_required":false,
        "error_msg":"Please select car parking",
    },
    {
        "key":"washrooms",
        "name":"washrooms",
        "label":"Washrooms",
        "display_index":6,
        "control_type":"NUMBER",
 
      "is_required":false,
        "error_msg":"Please enter washrooms",
        "min":1,
        "max":100,
    },
    {
        "key":"projectname",
        "name":"projectname",
        "label":"Project name",
        "display_index":7,
        "control_type":"TEXT",
 
      "is_required":false,
        "error_msg":"Please enter project name",
        "min":1,
        "max":100,
    },
    {
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":8,
        "control_type":"TEXT",
 
      "is_required":true,
        "error_msg":"Please enter ad title",
        "min":10,
        "max":100,
    },
    {
        "key":"description",
        "name":"description",
        "label":"Description",
        "display_index":9,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
 }  
},
{
    subcategory:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"For Sale Shops and offices",
        "display_index":4,
        photo_limit:[{
            "min":"1",
            "max":"50",
        }],
        card_display_string:"card display",
        description:"description",
        sorting_options:[{
            "key":0,
            "name":"ascending",
        },{
            "key":1,
            "name":"descending",
        }],
        parameters:[
            {
                "key":"furnishing",
                "name":"furnishing",
                "label":"Furnishing",
                "display_index":0,
                "control_type":"BUTTON_LiST",
                "values":[{
                    "key":0,
                    "name":"Furnished",
                },
            {
                    "key":1,
                    "name":"Unfurnished",
            },
        {
                    "key":2,
                    "name":"SemiFurnished",
        }],
          "is_required":false,
            "error_msg":"Please select Furnishing",
            },
    {
        "key":"construction status",
        "name":"construction status",
        "label":"Construction Status",
        "display_index":1,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"New Launch",
        },
    {
            "key":1,
            "name":"Ready To Move",
    },
{
            "key":2,
            "name":"Under Construction",
}],
  "is_required":false,
    "error_msg":"Please select Under Construction",
    },
    {
        "key":"listedby",
        "name":"listedby",
        "label":"Listed By",
        "display_index":2,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"Owner",
        },
    {
            "key":1,
            "name":"Dealer",
    },
{
            "key":2,
            "name":"Builder",
}],
  "is_required":false,
    "error_msg":"Please select Listed By",
    },
    {
        "key":"superbuiltuparea",
        "name":"superbuiltuparea",
        "label":"Super Builtup Area(ft2)",
        "display_index":3,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter super builtup area",
        "min":1,
        "max":1000,
    },
    {
        "key":"carpetarea",
        "name":"carpetarea",
        "label":"Carpet Area(ft2)",
        "display_index":4,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter carpet area ",
        "min":1,
        "max":1000,
    },
    {
        "key":"maintenance",
        "name":"maintenance",
        "label":"Maintenence(Monthly)",
        "display_index":5,
        "control_type":"NUMBER",
 
      "is_required":true,
        "error_msg":"Please enter monthly maintenance",
        "min":1,
        "max":1000,
    },

    {
        "key":"carparking",
        "name":"carparking",
        "label":"Car Parking",
        "display_index":6,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"4",
    },
    {
            "key":4,
            "name":"4+",
    }],
 
      "is_required":false,
        "error_msg":"Please select car parking",
    },
    {
        "key":"washrooms",
        "name":"washrooms",
        "label":"WashRooms",
        "display_index":7,
        "control_type":"NUMBER",
 
      "is_required":false,
        "error_msg":"Please enter washrooms",
        "min":1,
        "max":100,
    },
    {
        "key":"project"name"",
        "name":"project"name"",
        "label":"Project "name"",
        "display_index":8,
        "control_type":"TEXT",
 
      "is_required":false,
        "error_msg":"Please enter project "name"",
        "min":1,
        "max":100,
    },
    {
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":9,
        "control_type":"TEXT",
 
      "is_required":true,
        "error_msg":"Please enter ad title",
        "min":10,
        "max":100,
    },
    {
        "key":"description",
        "name":"description",
        "label":"Description",
        "display_index":10,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
 }  
},  
{
    subcategory:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"PG and Guest Houses",
        "display_index":5,
        photo_limit:[{
            "min":"1",
            "max":"50",
        }],
        card_display_string:"card display",
        description:"description",
        sorting_options:[{
            "key":0,
            "name":"ascending",
        },{
            "key":1,
            "name":"descending",
        }],
        parameters:[
            {
                "key":"subtype",
                "name":"subtype",
                "label":"subType",
                "display_index":0,
                "control_type":"BUTTON_LiST",
                "values":[{
                    "key":0,
                    "name":"Guest Houses",
                },
            {
                    "key":1,
                    "name":"PG",
            },
        {
                    "key":2,
                    "name":"Roommate",
        }],
          "is_required":false,
            "error_msg":"Please select subType",
            },
            {
                "key":"furnishing",
                "name":"furnishing",
                "label":"Furnishing",
                "display_index":1,
                "control_type":"BUTTON_LiST",
                "values":[{
                    "key":0,
                    "name":"Furnished",
                },
            {
                    "key":1,
                    "name":"Unfurnished",
            },
        {
                    "key":2,
                    "name":"SemiFurnished",
        }],
          "is_required":false,
            "error_msg":"Please select Furnishing",
            },
   
    {
        "key":"listedby",
        "name":"listedby",
        "label":"Listed By",
        "display_index":2,
        "control_type":"BUTTON_LiST",
        "values":[{
            "key":0,
            "name":"Owner",
        },
    {
            "key":1,
            "name":"Dealer",
    },
{
            "key":2,
            "name":"Builder",
}],
  "is_required":false,
    "error_msg":"Please select Listed By",
    },
 
    {
        "key":"carparking",
        "name":"carparking",
        "label":"Car Parking",
        "display_index":3,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"1",
        },
    {
            "key":1,
            "name":"2",
    },
{
            "key":2,
            "name":"3",
},
    {
            "key":3,
            "name":"4",
    },
    {
            "key":4,
            "name":"4+",
    }],
 
      "is_required":false,
        "error_msg":"Please select car parking",
    },

    {
        "key":"meals included",
        "name":"meals included",
        "label":"Meals Included",
        "display_index":4,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"No",
        },
    {
            "key":1,
            "name":"Yes",
    },
],
 
      "is_required":false,
        "error_msg":"Please select car parking",
    },
    {
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":5,
        "control_type":"TEXT",
 
      "is_required":true,
        "error_msg":"Please enter ad title",
        "min":10,
        "max":100,
    },
    {
        "key":"description",
        "name":"description",
        "label":"Description",
        "display_index":6,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
 }  
}, 
]