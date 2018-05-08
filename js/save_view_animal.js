function view_animal(animal_id, plugin_base, page_urls) 
{
    var requestURL = plugin_base + "/viewanimal.php?id=" + animal_id; //Build the request URL using the animal's ID

    var animal_details = get_animal_details(requestURL); //request animal data
    
    var output_area = document.getElementById('animal'); //Find the div element that our HTML will be placed inside of.

    var request_data = {output_fields: "", be_descriptions: ""}; //Initialize the object for pass-by-reference use

    request_configs(plugin_base, request_data); //Loads config.json which sets up the animal data fields and BE information

    //Assigns the data pulled from the configs function to it's own variable.
    var output_fields = request_data.output_fields;
    var be_descriptions = request_data.be_descriptions;
    var species_type = get_species(animal_details['Species']);

    // generate_back_button(species_type, page_urls, output_area); //Generate the Back to Dogs/Cats link

    setup_photo(output_area, animal_details); //Create the animal's picture element.

    generate_fields(output_fields, animal_details, output_area); //Create animal's details in a table

    generate_tooltips(be_descriptions); //generate behavior tooltips

    set_title(animal_details["AnimalName"]); //Set the page title to the animal's name
}

function get_animal_details(requestURL) {
    var animal_details;
    jQuery.ajax({
            type: 'GET',
            url: requestURL,
            dataType: 'json',
            success: function(data) {
                animal_details=data;
            },
            data: {},
            async: false
        });
    return animal_details;
}

function request_configs(plugin_base, request_data) {
    jQuery.ajax({
        url: plugin_base + "/config.json",
        dataType: 'json',
        async: false,
        success: function(data) {
            request_data.output_fields = data["fields"];
            request_data.be_descriptions = data["be_descriptions"];
        },
        error: function(x, text, error) {
            console.log(error);
        }
    });
}

function generate_back_button(animal_species, page_urls, output_area) {
    if(animal_species == 'Dog') {
        var back_button_url = page_urls.dogs;
    } else if(animal_species == 'Cat') {
        var back_button_url = page_urls.cats;
    } else if(animal_species == 'Other') {
        animal_species = "Other Animal";
        var back_button_url = page_urls.other;
    }

    //Create a back button and insert it before the output_area node. 
    var back_button = create_html_node('a', [{name: 'href', value: back_button_url}, {name: 'class', value: 'back-to'}], null, null, 'Back to ' + animal_species + 's');
    output_area.parentNode.insertBefore(back_button, output_area);
}

function generate_fields(output_fields, animal_details, output_area) {
    var age = format_age(animal_details['Age']);
    var size = format_size(animal_details['Size']);
    var species = animal_details['Species'];
    var breedIcon;
    if( species == 'Dog' ){
        breedIcon = '<img src="https://www.heartlandanimalshelter.org/wp-content/uploads/icons/icon-dog.svg">';
    }else if( species == 'Cat' ){
        breedIcon = '<img src="https://www.heartlandanimalshelter.org/wp-content/uploads/icons/icon-cat.svg">';
    }
    var animal_detail_node = 
        create_html_node('div', [ {name:'class',  value: 'animal-details'} ], output_area, [
            create_html_node('div', [ {name: 'class', value: 'meet-me'} ], null, null, '<h1>Meet ' + animal_details['AnimalName'] + '!</h1>'),
            create_html_node('div', [ {name:'class',  value: 'basic-info'} ], output_area, [
                create_html_node('div', [ {name: 'class', value: 'basic-info-unit breed'}], output_area, [
                    create_html_node('div', [ {name: 'class', value: 'icon'}], null, null, breedIcon ),
                    create_html_node('div', [ {name: 'class', value: 'title'}], null, null, 'Breed'),
                    create_html_node('div', [ {name: 'class', value: 'content'}], null, null, animal_details['PrimaryBreed']),
                ]),
                create_html_node('div', [ {name: 'class', value: 'basic-info-unit gender'}], output_area, [
                    create_html_node('div', [ {name: 'class', value: 'icon'}], null, null, '<img src="http://html.glantzdev.com/email_media/heartland/icon-gender.svg">'),
                    create_html_node('div', [ {name: 'class', value: 'title'}], null, null, 'Gender'),
                    create_html_node('div', [ {name: 'class', value: 'content'}], null, null, animal_details['Sex']),
                ]),
                create_html_node('div', [ {name: 'class', value: 'basic-info-unit age'}], output_area, [
                    create_html_node('div', [ {name: 'class', value: 'icon'}], null, null, '<img src="http://html.glantzdev.com/email_media/heartland/icon-age.svg">'),
                    create_html_node('div', [ {name: 'class', value: 'title'}], null, null, 'Age'),
                    create_html_node('div', [ {name: 'class', value: 'content'}], null, null, age),
                ]),
                create_html_node('div', [ {name: 'class', value: 'basic-info-unit size'}], output_area, [
                    create_html_node('div', [ {name: 'class', value: 'icon'}], null, null, '<img src="http://html.glantzdev.com/email_media/heartland/icon-size.svg">'),
                    create_html_node('div', [ {name: 'class', value: 'title'}], null, null, 'Size'),
                    create_html_node('div', [ {name: 'class', value: 'content'}], null, null, size),
                ]),
            ]),
            create_html_node('div', [ {name: 'class', value: 'about'}], null, null, '<h2>ABOUT ME</h2><p>' + animal_details['Dsc'] + '</p>'),
            create_html_node('div', [ {name: 'class', value: 'weight'}], null, null, '<h3>WEIGHT</h3><p>' + animal_details['BodyWeight'] + '</p>'),
            create_html_node('div', [ {name: 'class', value: 'spayed'}], null, null, '<h3>SPAYED/NEUTERED</h3><p>' + animal_details['Altered'] + '</p>'),
            create_html_node('div', [ {name: 'class', value: 'house-trained'}], null, null, '<h3>HOUSETRAINED</h3><p>' + animal_details['Housetrained'] + '</p>'),
            create_html_node('div', [ {name: 'class', value: 'location'}], null, null, '<h3>LOCATION</h3><p>' + animal_details['Location'] + '</p>'),
            create_html_node('div', [ {name: 'class', value: 'intake-date'}], null, null, '<h3>INTAKE DATE</h3><p>' + animal_details['LastIntakeDate'].substring(0,10) + '</p>'),
            //create_html_node('div', [ {name: 'class', value: 'price'}], null, null, '<h3>ADOPTION PRICE</h3><p>' + animal_details['Price'] + '</p>'),
        ]);
}

function set_title(animal_name) {
    document.title = animal_name + " - " + document.title;
}

function generate_tooltips(be_descriptions) {
    jQuery('sup').tooltip({content: 'These colors are used to categorize animals by behavior type. <br><br>' +
        '<b style="color: Green">Green:</b> ' + be_descriptions["green_be"] + '<br>' +
        '<b style="color: Orange">Orange:</b> ' + be_descriptions["orange_be"] + '<br>' +
        '<b style="color: Purple">Purple:</b> ' + be_descriptions["purple_be"]});
}

function create_html_node(node_type, attributes, parent_node, child_nodes, html_content) {
    var node = document.createElement(node_type);
    //Set node attributes
    if(attributes) {
        attributes.map(function(attribute) {
            node.setAttribute(attribute.name, attribute.value);
        });
    }

    if(html_content) {
        node.innerHTML = html_content;
    }

    //Set up any child nodes (recursive)
    if(child_nodes) {
        child_nodes.map(function(child_node) {
            node.appendChild(child_node);
        });
    }
    //Append to the parent_node, if set.
    if(parent_node) {
        parent_node.appendChild(node);
    }
    return node;
}

function load_photo(photo_url) {
    var image_element = jQuery('#animal-picture');
    var loading_spinner = jQuery('.loading');
    image_element.attr('style', 'background-image:url(' + photo_url  + ');');
}

function setup_photo(output_area, animal_details) {
    var videoID = animal_details['VideoID'];   
    var videoClass;
    if( typeof videoID !== 'string' ){
        var videoClass = 'no-video';
    }
    var animal_picture_container_node = 
            create_html_node('div', [ {name:'class',  value: 'animal-picture-container '} ], output_area, [
                create_html_node('div', [ {name: 'class', value: 'loading'} ]),
                create_html_node('div', [ {name: 'class', value: 'view-animal-picture'},
                                          {name: 'id',    value: 'animal-picture'},
                                          {name: 'style',   value: 'background-image:url(' + animal_details['Photo1'] + ');' }]),
                create_html_node('div', [ {name: 'id', value: 'photo-links'} ]),

                create_html_node('div', [ {name:'class',  value: 'animal-video ' + videoClass } ], output_area, [
                create_html_node('iframe', [ {name: 'class', value: 'view-animal-video'},
                                             {name: 'src',   value: 'https://www.youtube.com/embed/' + animal_details['VideoID']},
                                             {name: 'width', value: '560px'},
                                             {name: 'height', value: '349px'},
                                            ]),
                ])
            ]);

    setup_photo_links(animal_details);

}

function setup_photo_links(animal_details) {
    var photo_output_area = document.getElementById('photo-links');

    //Count the number of photo entries (Regex catches all Photo nodes with a link inside them, if it has no link, then it's a blank photo)
    var photo_regex = /"Photo[1-9]{1}":"http:/g;
    var num_of_photos = JSON.stringify(animal_details).match(photo_regex).length;

    //Create a button node for each picture, and add an event listener to fire when that button is clicked. 
     for(i=0; i<num_of_photos; i++) {
        //Don't want to output 0, so we add 1 to make it more user friendly.
        var photo_num = i+1;
        var photo_url = animal_details['Photo' + photo_num];
        var picture_element = create_html_node('button', [ 
                                {name: 'id',    value: 'photo' + photo_num},
                                {name: 'class', value: 'thumbnail'},
                                {name: 'style', value: 'background-image:url(' + photo_url + ');'},
                                ], 
                                photo_output_area,);
        if(photo_num==1) {
            jQuery('#photo1').addClass('active');
        }

        //Finally, add an event listener to switch to the picture when it's button is clicked (using load_photo).
        picture_element.addEventListener("click", load_photo.bind(null, photo_url));
        jQuery('#photo'+photo_num).click(function() {
            jQuery('.active').removeClass('active');
            jQuery(this).addClass('active');
        });
    }
}

function format_field(field_object, field_data) {
    var object_type = field_object.type;
    switch(object_type) {
        case "age": 
            return format_age(field_data);
            break;
        case "breed":
            return format_breed(field_data);
            break;
        case "desciption":
            return format_description(field_data);
            break;
        case "be":
            return format_be(field_data);
            break;
        default:
            break;
    }
}

function format_age(age) {
    //Age is set as Months.
    //12 months in a year.
    var years = Math.floor(age/12) 
    var months =  Math.floor(age%12);

    //return the age, ignoring years or months if it is set to 0
    return (years==0 ? "" : ((years>1) ? years + " years " : years + " year ")) + (months==0 ? "" : ((months>1) ? months + " months" : months + " month"));
    //return (years==0 ? "" : years + "y ") + (months==0 ? "" : months +"m");
}

function format_breed(breed) {
    //Reverse the breed string by the comma (ex. Chihuahua, Short Coat => Short Coat Chihuahua)
    var split_string = breed.split(", ");
    split_string.reverse();
    return split_string.join(" ");
}

function format_size(size) {
    if( size == 'S' ){
        return 'Small';
    }else if( size == 'M' ){
        return 'Medium';
    }else if( size == 'L' ){
        return 'Large';
    }else{
        return 'Extra Large';
    }
}

function format_description(desc) {
    //Remove any (initials) or [initials] notes inside the animal desciption.
   return desc.replace(/[\[\(]\w+[\)\]]/g, '');
}

function format_be(be_result) {
    //Colors the result as the behavior result's color. Also adds a small Superscript link at the end to link to a page where the BE colors are explained
    return "<span style='font-weight:bold; color: " + be_result + "'>" + be_result + "</span>   <sup title=''><a href='#'>What is this?</a></sup>";
}

function get_species(species) {
    if(species != "Dog" && species != "Cat") {
        return "Other";
    } else {
        return species;
    }
}
