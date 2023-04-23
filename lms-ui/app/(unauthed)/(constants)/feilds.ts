const loginFields=[
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
    {
        labelText:"First name",
        labelFor:"first-name",
        id:"first-name",
        name:"first-name",
        type:"text",
        autoComplete:"first-name",
        isRequired:true,
        placeholder:"First name",
        value:'' 
    },
    {
        labelText:"Last name",
        labelFor:"last-name",
        id:"last-name",
        name:"last-name",
        type:"text",
        autoComplete:"last-name",
        isRequired:true,
        value:'',
        placeholder:"Last name"   
    },
    {
        labelText:"Date of birth",
        labelFor:"date-of-birth",
        id:"date-of-birth",
        name:"date-of-birth",
        type:"date",
        autoComplete:"date-of-birth",
        isRequired:true,
        value:'',
        placeholder:"Date of birth"   
    },
    {
        labelText:"Email address",
        labelFor:"email-address",
        id:"email-address",
        name:"email-address",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        value:'',
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        value:'',
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirm-password",
        id:"confirm-password",
        name:"confirm-password",
        type:"password",
        autoComplete:"confirm-password",
        isRequired:true,
        value:'',
        placeholder:"Confirm Password"   
    },
    // {
    //     labelText:"Sign up as Librarian",
    //     labelFor:"isLibrarian",
    //     id:"isLibrarian",
    //     name:"isLibrarian",
    //     type:"checkbox",
    //     autoComplete:"isLibrarian",
    //     isRequired:false,
    //     value:true,
    //     placeholder:"Sign up as Librarian"   
    // },
]
const editProfileFields=[
    {
        labelText:"Date of birth",
        labelFor:"date-of-birth",
        id:"date_of_birth",
        name:"date-of-birth",
        type:"date",
        autoComplete:"date-of-birth",
        isRequired:false,
        placeholder:"Date of birth"   
    },
    {
        labelText:"Country",
        labelFor:"country",
        id:"country",
        name:"country",
        type:"text",
        autoComplete:"country",
        isRequired:false,
        placeholder:"country"   
    },
    {
        labelText:"City",
        labelFor:"city",
        id:"city",
        name:"city",
        type:"text",
        autoComplete:"city",
        isRequired:false,
        placeholder:"City"   
    },
    {
        labelText:"Address",
        labelFor:"address",
        id:"address",
        name:"address",
        type:"text",
        autoComplete:"address",
        isRequired:false,
        placeholder:"Address"   
    },
    {
        labelText:"Postal code",
        labelFor:"postalcode",
        id:"postalcode",
        name:"postalcode",
        type:"text",
        autoComplete:"postalcode",
        isRequired:false,
        placeholder:"Postal Code"   
    },
   
]




export {loginFields,signupFields, editProfileFields}