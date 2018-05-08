
function view_animal(animal_id, plugin_base, page_urls) 
{
    var requestURL = plugin_base + "/viewanimal.php?id=" + animal_id; //Build the request URL using the animal's ID

    var animal_details = get_animal_details(requestURL); //request animal data
    
    var output_area = document.getElementById('animal'); //Find the div element that our HTML will be placed inside of.

    var request_data = {output_fields: "", be_descriptions: ""}; //Initialize the object for pass-by-reference use

    request_configs(plugin_base, request_data); //Loads config.json which sets up the animal data fields and BE information


    //Variables

    var animalPhoto1 = 'background-image:url(' + animal_details['Photo1'] + ');';
    var animalPhoto2 = 'background-image:url(' + animal_details['Photo2'] + ');';
    var animalPhoto3 = 'background-image:url(' + animal_details['Photo3'] + ');';

    var videoID = animal_details['VideoID'];
    var videoUrl = 'https://www.youtube.com/embed/' + videoID;
    var videoClass;
    if( typeof videoID !== 'string' ){
        var videoClass = 'no-video';
    }

    var animalName = animal_details['AnimalName'];

    var animalSpecies = animal_details['Species'];
    var animalBreed = animal_details['PrimaryBreed'];
    var animalSex = animal_details['Sex'];
    var animalAge = format_age(animal_details['Age']);
    var animalSize = format_size(animal_details['Size']);

    var animalDsc = animal_details['Dsc'];
    var animalWeight = animal_details['BodyWeight'];
    var animalAltered = animal_details['Altered'];
    var animalHousetrained = animal_details['Housetrained'];
    var animalLocation = animal_details['Location'];
    var animalIntakeDate = animal_details['LastIntakeDate'].substring(0,10);

    //Left Column Outputs
    
    jQuery('#animal #animal-picture').attr('style', animalPhoto1);

    jQuery('#animal #photo-links #photo1').attr('style', animalPhoto1);
    jQuery('#animal #photo-links #photo2').attr('style', animalPhoto2);
    jQuery('#animal #photo-links #photo3').attr('style', animalPhoto3);

    jQuery('#animal .animal-video').addClass(videoClass);
    jQuery('#animal .animal-video iframe').attr('src', videoUrl);
    
    //Right Column Outputs

    jQuery('#animal .meet-me').html('<h1>Meet ' + animalName + '!</h1>');

    jQuery('#animal .breed').addClass(animalSpecies);
    jQuery('#animal .breed .content').text(animalBreed);
    jQuery('#animal .gender .content').text(animalSex);
    jQuery('#animal .age .content').text(animalAge);
    jQuery('#animal .size .content').text(animalSize);

    jQuery('#animal .about').append('<p>'+ animalDsc + '</p>');
    jQuery('#animal .weight').append('<p>'+ animalWeight + '</p>');
    jQuery('#animal .spayed').append('<p>'+ animalAltered + '</p>');
    jQuery('#animal .house-trained').append('<p>'+ animalHousetrained + '</p>');
    jQuery('#animal .location').append('<p>'+ animalLocation + '</p>');
    jQuery('#animal .intake-date').append('<p>'+ animalIntakeDate + '</p>');

    //Click button change photo

    jQuery('#animal #photo-links button').click(function(){
        jQuery('#animal #photo-links button').removeClass('active');
        jQuery(this).addClass('active');
        var activeStyle = jQuery('#animal #photo-links .active').attr('style');
        jQuery('#animal #animal-picture').attr('style', activeStyle);
    });


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

//Format Size
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

//Format Age
function format_age(age) {
    //Age is set as Months.
    //12 months in a year.
    var years = Math.floor(age/12) 
    var months =  Math.floor(age%12);

    //return the age, ignoring years or months if it is set to 0
    return (years==0 ? "" : ((years>1) ? years + " years " : years + " year ")) + (months==0 ? "" : ((months>1) ? months + " months" : months + " month"));
    //return (years==0 ? "" : years + "y ") + (months==0 ? "" : months +"m");
}

