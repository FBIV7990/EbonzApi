[
    {
        Mobiles:{
            
            category_id:"5d6cbb7d0b782a315409bc5b",
            "name":"Mobile Phones",
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
    
            parameters:[
                {"key":"brand",
                "name":"brand",
                "label":"Brand",
                "display_index":0,
                "control_type":"SELECT",
                "values":[{
                    "key":0,
                    "name":"Asus"
                      },
                      {
                    "key":1,
                    "name":"BlackBerry"
                    },
                    {
                     "key":2,
                     "name":"Gionee"
                    },
                    {
                        "key":3,
                        "name":"HTC"
                       },
                       {
                        "key":4,
                        "name":"Intex"
                       },
                       {
                        "key":5,
                        "name":"iPhone"
                       },
                       {
                        "key":6,
                        "name":"Karbonn"
                       },
                       {
                        "key":7,
                        "name":"Lava"
                       },
                       {
                        "key":8,
                        "name":"Lenovo"
                       },
                       {
                        "key":9,
                        "name":"LG"
                       },
                       {
                        "key":10,
                        "name":"Mi"
                       },
                       {
                        "key":11,
                        "name":"Micro"max""
                       },
                       {
                        "key":12,
                        "name":"Motorola"
                       },
                       {
                        "key":13,
                        "name":"Nokia"
                       }, {
                        "key":14,
                        "name":"One Plus"
                       },
                       , {
                        "key":15,
                        "name":"Oppo"
                       },
                       , {
                        "key":16,
                        "name":"Samsung"
                       },
                       , {
                        "key":17,
                        "name":"Sony"
                       },
                       , {
                        "key":18,
                        "name":"Vivo"
                       },
                       , {
                        "key":19,
                        "name":"Other Mobiles"
                       },
        ],
                "is_required":true,
                "error_msg":"please select brand",
    },
    {
            
        "key":"model",
        "name":"model",
        "label":"Model",
        "display_index":1,
        "control_type":"TEXT",
 
      "is_required":true,
        "error_msg":"Please enter model",
        "min":10,
        "max":100,
    },         
        {
            
            "key":"adtitle",
            "name":"adtitle",
            "label":"Ad Title",
            "display_index":1,
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
            "display_index":2,
            "control_type":"TEXTAREA",
     
          "is_required":true,
            "error_msg":"Please enter description",
            "min":1,
            "max":400,
        }]
        }},
        {
 Mobiles:{
        category_id:"5d6cbb7d0b782a315409bc5b",
        "name":"Accessories",
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
        "key":"type",
        "name":"type",
        "label":"Type",
        "display_index":0,
        "control_type":"BUTTON_LIST",
        "values":[{
            "key":0,
            "name":"Mobiles",
        },
    {
            "key":1,
            "name":"Tablets",
    },
],
"is_required":true,
"error_msg":"please select type"
 },
            
    {
        
        "key":"adtitle",
        "name":"adtitle",
        "label":"Ad Title",
        "display_index":1,
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
        "display_index":2,
        "control_type":"TEXTAREA",
 
      "is_required":true,
        "error_msg":"Please enter description",
        "min":1,
        "max":400,
    }]
            }},
    {
        Mobiles:{
        
                category_id:"5d6cbb7d0b782a315409bc5b",
                "name":"Tablets",
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
                "key":"type",
                "name":"type",
                "label":"Type",
                "display_index":0,
                "control_type":"BUTTON_LIST",
                "values":[{
                    "key":0,
                    "name":"iPad",
                },
            {
                    "key":1,
                    "name":"Samsung",
            },{
                    "key":2,
                    "name":"Other Tablets",
            }
        ],
            "is_required":true,
            "error_msg":"please select type",
         },
                    
            {
                
                "key":"adtitle",
                "name":"adtitle",
                "label":"Ad Title",
                "display_index":1,
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
                "display_index":2,
                "control_type":"TEXTAREA",
         
              "is_required":true,
                "error_msg":"Please enter description",
                "min":1,
                "max":400,
            }]
        }
    }
]