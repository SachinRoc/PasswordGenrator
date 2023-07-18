const inputSlider = document.querySelector("[data-lengthSlider]");  // custom attribute syntax
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");

const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbol = '~`!@#$%^&*()_-{[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set strength circle to greay
setIndicator("#ccc");

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min =inputSlider.min;
    const max =inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min) *100/(max-min) + "% 100%")


}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}


function getRenInteger(min , max){
   return Math.floor(Math.random() * (max-min)) + min;     
}


function generateRandomNumber(){
    return getRenInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRenInteger(97,123));
}

function generateUpperCase(){
    // convert ASCCI number range to char
    return String.fromCharCode(getRenInteger(65,91));
}

function generateSymbol(){
     const randNum = getRenInteger(0,symbol.length);
     return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
       setIndicator("#0f0");

    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    
    }
    catch(e){
     copyMsg.innerText = "Faild";
    }

    copyMsg.classList.add("active")
    setTimeout ( () =>{
        copyMsg.classList.remove("active");
    },2000 );

}

function shufflePassword(array){
    // fisher yates Method
   for(let i = array.length-1 ; i>0 ; i--){
    const j = Math.floor(Math.random() * (i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
   }
  
   let str = "";
   array.forEach((el) => (str += el));
   return str;

}

function handleCheckBoxChange(){
      checkCount = 0;
      allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
          checkCount++;
      })

      // special case
      if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
      }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change' , handleCheckBoxChange);
})

inputSlider.addEventListener('input' ,(e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click' ,() =>{
    // none of the checkbox are selected 
    if(checkCount ==0)return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journeyto find new password;

    // remove old password
   // console.log('journy start');
    password = "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }

    
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


  let funcArr = [];

  if(uppercaseCheck.checked)
     funcArr.push(generateUpperCase);

  if(lowercaseCheck.checked)
     funcArr.push(generateLowerCase);   

  if(numberCheck.checked)
     funcArr.push(generateRandomNumber);

  if(symbolsCheck.checked)
     funcArr.push(generateSymbol);  


     // compulsory addtion

     for(let i = 0 ; i<funcArr.length ; i++){
       // console.log('compulsory addtion');
        password += funcArr[i]();
     }

     // remaining addition
    
     for(let i = 0 ; i<passwordLength - funcArr.length ; i++ ){
        let randomIndex = getRenInteger(0 , funcArr.length);
     //   console.log('remaining addtion');
        password += funcArr[randomIndex]();
     }
    // console.log('outer loop of remainig password');

     // shuffle the password
   //  console.log('suffle password');
     password = shufflePassword(Array.from(password));

     // show in UI
   //  console.log('display password');
     passwordDisplay.value = password

     // calculate strength
     calcStrength();
})