const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+){0,2}$/;
const cnicpattern=/^\d{5}-\d{7}-[0-9]$/
const expression=/^[a-f0-9]{24}$/
const contact=/^\d{4}-\d{7}$/
const emailPattern=/^[A-Za-z0-9]+@[a-z]+\.[a-z]{2,3}$/
// const passwordPattern=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
const passwordPattern=/^.{8}$/

const specialChars = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]$/
const roles=['admin','user']



const Constraints={
    namePattern,
    cnicpattern,
    expression,
    contact,
    specialChars,
    emailPattern,
    passwordPattern,
    roles
}

module.exports=Constraints