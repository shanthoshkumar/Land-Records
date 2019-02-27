

var _web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Vr1GWcLG0XzcdrZHWMPu'));
var contract_address='0xd844bad650c86dcea4b3e367322011973265be2b'//'0x90a39cd848cbd565126e1559829135423553b491';
const abi_json=[
	{
		"constant": false,
		"inputs": [
			{
				"name": "data_identifier",
				"type": "string"
			},
			{
				"name": "data",
				"type": "string"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "geo_coordinates",
				"type": "string"
			},
			{
				"name": "land_dimensions",
				"type": "string"
			}
		],
		"name": "createRecord",
		"outputs": [
			{
				"name": "isCreated",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user_address",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "record_number",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "data_identifier",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "data",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "geo_coordinates",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "land_dimensions",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "recorded_time",
				"type": "uint256"
			}
		],
		"name": "recordCreation",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "user_address",
				"type": "address"
			}
		],
		"name": "noOfUserRecords",
		"outputs": [
			{
				"name": "noOfRecords",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "user_address",
				"type": "address"
			},
			{
				"name": "record_number",
				"type": "uint256"
			}
		],
		"name": "showRecordByKeys",
		"outputs": [
			{
				"name": "data_identifier",
				"type": "string"
			},
			{
				"name": "data",
				"type": "string"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "geo_coordinates",
				"type": "string"
			},
			{
				"name": "land_dimensions",
				"type": "string"
			},
			{
				"name": "recorded_time",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
let landrecord = new this._web3.eth.Contract(abi_json,contract_address,{gaslimit:3000000});
console.log(_web3.version);


function store_data(){
    document.getElementById('loader').style.display = "block";

$('#data_identifier').val()

    var identifier=$('#data_identifier').val();
    var data=$('#data').val();
    var amount=$('#amount').val();
    var geo=$('#geo').val();
    var land=$('#land').val();


    let _privatekey='0x'+localStorage.getItem('privatekey');
    console.log(_privatekey);
    let user_address=localStorage.getItem('publickey');
    console.log(user_address);
    
    _web3.eth.getTransactionCount(user_address,function(err,result){
        var nonce = result.toString(16);

    const tx = {
        to: contract_address,
        gas: 850000,
        data:landrecord.methods.createRecord(identifier,data,parseInt(amount),geo,land).encodeABI(),
    };

        _web3.eth.accounts.signTransaction(tx, _privatekey,function(err,res){
console.log(res);

        _web3.eth.sendSignedTransaction( res.rawTransaction).on('transactionHash', txHash => {
            console.log("txHash", txHash); tx1=txHash }
        ).on('receipt',
            receipt => {
                 console.log("receipt", receipt)
          if(receipt["status"]== "0x1"){
            // document.getElementById('ld').style.display = 'none';
            console.log("success");
        document.getElementById('address').innerText=user_address;
        document.getElementById('transaction_id').innerText=receipt.logs[0].id;
        document.getElementById('transaction_url').innerText="https://ropsten.etherscan.io/tx/"+receipt['transactionHash'];
        document.getElementById('loader').style.display = "none";

        $('#exampleModal').modal('show');


          }
        })
    

})

})
}


function destroy(){
    $('#data_identifier').val('');
    $('#data').val('');
    $('#amount').val('');
    $('#geo').val('');
    $('#land').val('');
    document.getElementById('address').innerText='';
    document.getElementById('transaction_id').innerText='';
    document.getElementById('transaction_url').innerText='';


}





function retrieve(){
    var user_account=$('#user_account').val();
      landrecord.methods.noOfUserRecords(user_account).call(function(err,res){
        if(err)
        {
            console.log(err);    
        }
        else{
            let arr=[];

            for(var i=1;i<=res;i++){
                arr.push(i);
            }
            get_user_records(user_account,arr);
        }
        
    })
}
function get_user_records(account,records){
    records.forEach(i=>{
        landrecord.methods.showRecordByKeys(account,i).call(function(err,res){
        if(err){
            console.log(err);
            
        }
        else
        {  console.log(res);
            var _time= new Date(res.recorded_time*1000);
            $("#table_content").append('<tr><td>'+account+'</td><td>'+ res.data_identifier +'</td> <td>'+res.amount+'</td><td>'+res.geo_coordinates+'</td><td>'+res.land_dimensions+'</td><td>'+_time+'</td></tr>');      
        }
     })
    })
    $('#data_modal').modal('show');

}

function clear_field(){
    $('#user_account').val('');
}

function clear_keys(){
    localStorage.clear();
}