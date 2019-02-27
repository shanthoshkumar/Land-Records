pragma solidity ^0.4.0;

contract LandRecords{
    
    struct landRecord{
        string data_identifier;
        string data;
        uint256 amount;
        string geo_coordinates;
        string land_dimensions;
    }

    mapping(address =>mapping(uint256 => landRecord)) map; //key1:user address key2:no_of_user_records
    
    mapping(address =>uint256) no_of_user_records; //key:user address
    
    event recordCreation(address user_address,uint256 record_number,string data_identifier,string data,uint256 amount,string geo_coordinates,string land_dimensions);
    
    
    function createRecord(string memory data_identifier,string memory data,uint256 amount,string memory geo_coordinates,string memory land_dimensions) public returns(bool isCreated){
        
        no_of_user_records[msg.sender]++;
        uint256 index = no_of_user_records[msg.sender];
        
        map[msg.sender][index].data_identifier = data_identifier;
        map[msg.sender][index].data = data;
        map[msg.sender][index].amount = amount;
        map[msg.sender][index].geo_coordinates = geo_coordinates;
        map[msg.sender][index].land_dimensions = land_dimensions;
        emit recordCreation(msg.sender, index, data_identifier, data,amount, geo_coordinates, land_dimensions);
        
        return true;
    }
    
    function  showRecordByKeys(address user_address,uint256 record_number) view returns(
        
        string memory data_identifier,
        string memory data,
        uint256 amount,
        string memory geo_coordinates,
        string memory land_dimensions
        ) {
            
        return(
            map[user_address][record_number].data_identifier,
            map[user_address][record_number].data,
            map[user_address][record_number].amount,
            map[user_address][record_number].geo_coordinates,
            map[user_address][record_number].land_dimensions
        );
        
    }
    
    function noOfUserRecords(address user_address) public view returns(uint256 noOfRecords){
        return no_of_user_records[user_address];
    }
}