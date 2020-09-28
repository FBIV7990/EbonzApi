[{
    cars:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"Cars",
        "display_index":0,
        photo_limit:[{
            "min":"10",
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
            "key":"brand",
            "name":"brand",
            "label":"Brand",
            "display_index":0,
            "control_type":"TEXT",          
            "is_required":false,
            "error_msg":"Please enter brand",
},{
    "key":"model",
    "name":"model",
    "label":"Model",
    "display_index":1,
    "control_type":"TEXT",          
    "is_required":false,
    "error_msg":"Please enter model",
},
    {
        "key":"year",
        "name":"year",
        "label":"Year",
        "display_index":2,
        "control_type":"TEXT", 
        "is_required":false,
        "error_msg":"Please enter year",
        "min":1,
        "max":100,
    },
    {
        "key":"fuel",
        "name":"fuel",
        "label":"Fuel",
        "display_index":3,
        "control_type":"BUTTON_LIST",
        "values":[
            {
                "key":0,
                "name":"CNG & Hybrids",
        },
        {
                "key":1,
                "name":"Diesel",
        },
        {
                "key":2,
                "name":"LPG",
        },
        {
                "key":3,
                "name":"Petrol",
        }],
        "is_required":false,
        "error_msg":"Please select fuel",
    },
    {
            "key":"kmdriven",
            "name":"kmdriven",
            "label":"KM Driven",
            "display_index":4,
            "control_type":"TEXT",
             "is_required":false,
             "error_msg":"Please enter km driven",
             "min":0,
             "max":10000,
    },
    {
        
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":4,
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
        "display_index":5,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]

    }},
    {
        cars:{
            category_id:"5d6cbb7d0b782a315409bc5b",
            "name":"Commercial Vehicles",
            "display_index":1,
            photo_limit:[{
                "min":"10",
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
            "key":"year",
            "name":"year",
            "label":"Year",
            "display_index":0,
            "control_type":"TEXT",
     
          "is_required":true,
            "error_msg":"Please enter year",
            "min":1,
            "max":100,
        },
        {
                "key":"km driven",
                "name":"km driven",
                "label":"Km Driven",
                "display_index":1,
                "control_type":"TEXT",
                 "is_required":true,
                 "error_msg":"Please enter km driven",
                 "min":0,
                 "max":10000,
        },
        {
            
            "key":"adtitle",
            "name":"adtitle",
            "label":"Ad Title",
            "display_index":2,
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
            "display_index":3,
            "control_type":"TEXTAREA",
     
          "is_required":true,
            "error_msg":"Please enter description",
            "min":1,
            "max":400,
        }]
        }},
        {
            cars:{


                category_id:"5d6cbb7d0b782a315409bc5b",
                "name":"Spare Parts",
                "display_index":2,
                photo_limit:[{
                    "min":"10",
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
                
                "key":"adtitle",
                "name":"adtitle",
                "label":"Ad Title",
                "display_index":0,
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
                "display_index":1,
                "control_type":"TEXTAREA",
         
              "is_required":true,
                "error_msg":"Please enter description",
                "min":1,
                "max":400,
            }]
            }},
{
    cars:{
        
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"Other Vehicles",
        "display_index":3,
        photo_limit:[{
            "min":"10",
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
        
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":0,
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
        "display_index":1,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
    }},

]