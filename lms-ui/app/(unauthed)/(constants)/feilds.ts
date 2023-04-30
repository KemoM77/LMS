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
const addBookFields=[
    {
        labelText:"Title",
        labelFor:"title",
        id:"title",
        name:"title",
        type:"text",
        autoComplete:"title",
        isRequired:true,
        placeholder:"Title",
        value:'' 
    },
    {
        labelText:"Pages",
        labelFor:"pages",
        id:"pages",
        name:"pages",
        type:"number",
        autoComplete:"pages",
        isRequired:true,
        value:'',
        placeholder:"Pages"   
    },
    {
        labelText:"In Stock",
        labelFor:"in_stock",
        id:"in_stock",
        name:"in_stock",
        type:"number",
        autoComplete:"in_stock",
        isRequired:true,
        value:'',
        placeholder:"In Stock"   
    },
    {
        labelText:"Published",
        labelFor:"published",
        id:"published",
        name:"published",
        type:"number",
        autoComplete:"published",
        isRequired:true,
        value:'',
        placeholder:"Published"   
    },
    {
        labelText:"Cover Image URL",
        labelFor:"cover_img",
        id:"cover_img",
        name:"cover_img",
        type:"url",
        autoComplete:"cover_img",
        isRequired:false,
        value:'',
        placeholder:"Cover Image URL"   
    },
    {
        labelText:"Authors",
        labelFor:"authors",
        id:"authors",
        name:"authors",
        type:"text",
        autoComplete:"authors",
        isRequired:true,
        value:'',
        placeholder:"Authors"   
    },
    {
        labelText:"Price(USD)",
        labelFor:"price",
        id:"price",
        name:"price",
        type:"number",
        autoComplete:"price",
        isRequired:true,
        value:'',
        placeholder:"Price"   
    },
    {
        labelText:"ISBN",
        labelFor:"isbn",
        id:"isbn",
        name:"isbn",
        type:"number",
        autoComplete:"isbn",
        isRequired:false,
        value:'',
        placeholder:"ISBN"   
    },
    {
        labelText:"ISBN13",
        labelFor:"isbn13",
        id:"isbn13",
        name:"isbn13",
        type:"number",
        autoComplete:"isbn13",
        isRequired:true,
        value:'',
        placeholder:"ISBN13"   
    },
    // {
    //     labelText:"description",
    //     labelFor:"description",
    //     id:"discription",
    //     name:"discription",
    //     type:"text",
    //     autoComplete:"discription",
    //     isRequired:false,
    //     value:'',
    //     placeholder:"Discription"   
    // },
    // {
    //     labelText:"Langauge",
    //     labelFor:"langauge",
    //     id:"langauge",
    //     name:"langauge",
    //     type:"text",
    //     autoComplete:"langauge",
    //     isRequired:true,
    //     value:'',
    //     placeholder:"Langauge"   
    // },
    {
        labelText:"Location",
        labelFor:"location",
        id:"location",
        name:"location",
        type:"text",
        autoComplete:"location",
        isRequired:true,
        value:'',
        placeholder:"Location"   
    },
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




export {loginFields,signupFields, editProfileFields ,addBookFields}