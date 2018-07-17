<?php
/**
 * Based on the Whise Documentation
 */

error_reporting(E_ALL ^ E_WARNING);
$url = "http://webservices.whoman2.be/websiteservices/EstateService.svc";
$clientID = "xxxxxxxxxxxx";
$officeID = -1;

function get($method, $varname, $request) {
    global $url;
    $geturl = "$url/$method?$varname=" . json_encode($request); $response = file_get_contents($geturl);
    return json_decode(json_encode(simplexml_load_string($response)));
}

function post($method, $varname, $body)
{
    global $url;
    $posturl = "$url/$method";
    $data = '{"' . $varname . '": ' . json_encode($body) . '}';
    $options = array(
        'http' => array(
            'header' => "Content-type: application/json\r\nContent-length: " . strlen($data), 'method' => 'POST',
            'content' => $data
        ),);
    $context = stream_context_create($options);
    $result = file_get_contents($posturl, false, $context);
    return json_encode($result);
}

function getValue($parent, $name, $index) {
    $vars = is_array($parent) ? get_object_vars($parent[$index]) : get_object_vars($parent);
    return $vars[$name];
}
// Define Contact class
class Contact {
    public $__type = "EstateServiceUpdateContactRequest:Whoman.Estate";
    public $ClientID;
    public $Address1;
    public $Address2;
    public $AgreementMail;
    public $AgreementSms;
    public $Box;
    public $City;
    public $Comments;
    public $ContactOriginID;
    public $ContactTitleID;
    public $ContactTypeIDList;
    public $CountryID;
    public $EstateID;
    public $FacebookLogin;
    public $FirstName;
    public $LanguageID;
    public $Message;
    public $Name;
    public $Number;
    public $OfficeID;
    public $PrivateEmail;
    public $PrivateMobile;
    public $PrivateTel;
    public $RepresentativeIDList;
    public $SearchCriteria;
    public $StatusID;
    public $Zip;
}
// Define ContactSearchCriteria
class ContactSearchCriteria {
    public $__type = "EstateServiceUpdateContactRequestSearchCriteria:Whoman.Estate";
    public $AreaRange;
    public $CategoryIdList;
    public $CountryId;
    public $EnumID_1;
    public $Fronts;
    public $Furnished;
    public $Garage;
    public $Garden;
    public $GardenAreaRange;
    public $GroundAreaRange;
    public $InvestmentEstate;
    public $MinRooms;
    public $NumericValue_1;
    public $Parking;
    public $PriceRange;
    public $PurposeIdList;
    public $PurposeStatusIdList;
    public $RegionIDList;
    public $State;
    public $SubCategoryIdList;
    public $SubdetailID_1;
    public $Terrace;
    public $TextValue_1;
    public $ZipList;
}

// Get contact origins
$contactOrigins = get('GetContactOriginListXml', 'EstateServiceGetContactOriginListRequest', array('ClientId' => $clientID, 'OfficeId' => $officeID, 'Page' => 0, 'RowsPerPage' => 10, 'Language' => 'nl-BE'))->ContactOriginList->EstateServiceGetContactOriginListResponseContactOrigin;
// Get contact types
$baseContactTypes = get('GetContactTypeListXml', 'EstateServiceGetContactTypeListRequest', array('ClientId' => $clientID, 'OfficeId' => $officeID, 'Page' => 0, 'RowsPerPage' => 10, 'Language' => 'nl-BE'))->BaseContactTypeList->EstateServiceGetContactTypeListResponseBaseContactType;
// Get contact titles
$contactTitles = get('GetContactTitleListXml', 'EstateServiceGetContactTitleListRequest', array('ClientId' => $clientID, 'OfficeId' => $officeID, 'Page' => 0, 'RowsPerPage' => 10, 'Language' => 'nl-BE'))->ContactTitleList->EstateServiceGetContactTitleListResponseContactTitle;


// Define search criteria
$searchCriteria = new ContactSearchCriteria(); $searchCriteria->AreaRange = array(1, 999); $searchCriteria->CategoryIdList = array(1); $searchCriteria->CountryId = 1; $searchCriteria->Fronts = 3; $searchCriteria->Furnished = 0; $searchCriteria->Garage = 1;
$searchCriteria->Garden = 1;
$searchCriteria->GardenAreaRange = array(5, 400);
$searchCriteria->GroundAreaRange = array(200, 1000);
$searchCriteria->InvestmentEstate = 0;
$searchCriteria->MinRooms = 3;
$searchCriteria->Parking = 1;
$searchCriteria->PriceRange = array(200000, 500000);
$searchCriteria->PurposeIdList = array(1);
$searchCriteria->PurposeStatusIdList = array(1);
$searchCriteria->RegionIDList = array(1826);
$searchCriteria->State = 1;
$searchCriteria->SubCategoryIdList = array(1);
$searchCriteria->Terrace = 1;
$searchCriteria->ZipList = array('1200');


// Define contact
$contact = new Contact();
$contact->ClientID = $clientID;
$contact->Address1 = "address1";
$contact->Address2 = "address2";
$contact->AgreementMail = true;
$contact->AgreementSms = true;
$contact->Box = "box";
$contact->City = "city";
$contact->Comments = "comments";
$contact->ContactOriginID   = getValue($contactOrigins, 'ContactOriginId', 0); //Todo Should be remove by something else
$contact->ContactTitleID    = getValue($contactTitles, 'ContactTitleId', 0); //Todo Should be remove by something else
$contact->ContactTypeIDList = array(getValue($baseContactTypes[0]->ContactTypes->EstateServiceGetContactTypeListResponseContactType, 'ContactTypeId', 0)); //Todo Should be remove by something else
$contact->CountryID = 1;
$contact->FirstName = "first name";
$contact->LanguageID = 'en-GB';
$contact->Message = "message";
$contact->Name = "name mod";
$contact->Number = "num";
$contact->OfficeID = $officeID;
$contact->PrivateEmail = "private email";
$contact->PrivateMobile = "private mobile";
$contact->PrivateTel = "private tel";
$contact->SearchCriteria = $contact->StatusID = 1;
$contact->StatusID = 1;
$contact->Zip = "1200";

print_r(post('UpdateContact', 'estateServiceUpdateContactRequest', $contact)); echo "Contact updated";

