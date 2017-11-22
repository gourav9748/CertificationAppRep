({
    newUserSubmit : function(component, name1, id1, email1, location1) {
        component.set("v.btnRegNewUserBack", true);
        component.set("v.btnRegNewUser", true);
        var action = component.get("c.newUserReg");
         action.setParams({ 
             "name": name1, 
             "idnew": id1,
             "Email": email1,
             "Location":location1           
        }); 
        action.setCallback(this, function(response) {
            var state = response.getState();       
            console.log('userRegistration method:'+state);
            if (component.isValid() && state === "SUCCESS") 
            {                
                var msg = response.getReturnValue();  
                console.log(msg);
                //console.log(JSON.parse(lstData));
                if(msg == 'true')
                {                    
                    alert('Registration successful!!');
                    this.show(component,'verificationPanel');
                    this.hide(component,'registrationPanel');
                    component.find("outputEmail1").set("v.value",id1);
                    component.set("v.outputEmail", email1);
                    component.set("v.Name", name1);
                    var text = 'Enter verification code sent to '+email1;
                    component.set("v.codePlaceholder", text);
                }              
                else if(msg == 'Duplicate Email')
                {
                    alert('Registration un-successful: Associate with given email address already exists!!');
                }
                else if(msg == 'Duplicate Id')
                {
                    alert('Registration un-successful: Associate with given employee id already exists!!');
                }
                else
                {
                    alert(msg);
                }               
                  
            }
            component.set("v.btnRegNewUserBack", false);
            component.set("v.btnRegNewUser", false);
        });
        $A.enqueueAction(action); 
    },
    
    hide : function(component, val) {
        var infoPanel = component.find(val);
        //console.log(infoPanel);
        $A.util.removeClass(infoPanel, 'show');                                                  
        $A.util.addClass(infoPanel, 'hide');
    },
    getLoc : function(component)
    {
        var action = component.get("c.getLocations");
        
        action.setCallback(this, function(response) {
            var state = response.getState();       
            console.log('Location method:'+state);
            if (component.isValid() && state === "SUCCESS") 
            {                
                var lstData = response.getReturnValue();  
                //console.log(JSON.parse(lstData));
                if(lstData !=null && lstData != undefined)
                {
                    console.log(lstData);                   
                    component.set("v.listData", lstData);  
                }                
            }
        });
        $A.enqueueAction(action);   
    },
    
    //getCertData
    getCertData : function(component)
    {
        var action = component.get("c.getCertificates");
        
        action.setCallback(this, function(response) {
            var state = response.getState();       
            console.log('GetCertificates method:'+state);
            if (component.isValid() && state === "SUCCESS") 
            {                
                var lstData = response.getReturnValue();  
                //console.log(JSON.parse(lstData));
                if(lstData !=null && lstData != undefined)
                {
                    console.log(lstData);                   
                    component.set("v.listCertData", lstData);  
                }                
            }
        });
        $A.enqueueAction(action);  
        
    },
    
    show : function(component, val) {
        var infoPanel = component.find(val);
        //console.log(infoPanel);
        $A.util.removeClass(infoPanel, 'hide');                                                  
        $A.util.addClass(infoPanel, 'show');
    },
    
    check : function(component, inId1){
        //calling controller method
        component.set("v.btncheckEmail", true);
        component.set("v.btnBackRegUser", true);
        var msg = '';
        console.log('checkId function in helper');
        var action = component.get("c.checkId");
        action.setParams({ 
            "strId1": inId1           
        }); 
        
        action.setCallback(this, function(response) {
            var state = response.getState();       
            console.log(state);
            if (component.isValid() && state === "SUCCESS") 
            {
                var infoPanel1 = component.find("inputPanel");
                var emailMsg = component.find("emailAlert");
                var lstData = response.getReturnValue();  
                
                //console.log(JSON.parse(lstData));
                if(lstData !=null && lstData != undefined)
                {
                    console.log(lstData[0].Name__c);
                    var emailAdd1 = lstData[0].Email__c;
                    $A.util.removeClass(infoPanel1, 'has-error');
                    this.hide(component, 'emailAlert');
                    //hide inputPanel
                    this.hide(component, 'inputPanel');
                    //show verificationPanel
                    this.show(component, 'verificationPanel');
                    component.set("v.Name", lstData[0].Name__c);
                    component.set("v.outputEmail", emailAdd1); 
                    component.find("outputEmail1").set("v.value",lstData[0].Emp_Id__c);
                    var text = 'Enter verification code sent to '+emailAdd1;
                    component.set("v.codePlaceholder", text);
                }
                else
                {
                    //Error message in case invalid email
                    $A.util.addClass(infoPanel1, 'has-error');
                    this.show(component, 'emailAlert');
                    emailMsg.set("v.value",' User not registered yet!!');
                    component.set("v.btncheckEmail", false);
                    component.set("v.btnBackRegUser", false);
                }
            }
        });
        $A.enqueueAction(action); 
        return msg;
    },
    
    submit : function (component, idd, code)
    {
        var msg = '';
        var infoPanel2 = component.find("codePanel");
        console.log('submit function in helper');
        var action1 = component.get("c.checkSubmit");
        action1.setParams({ 
            "id3": idd,
            "code1": code
        }); 
        
        action1.setCallback(this, function(response) {
            var state1 = response.getState();  
            console.log(state1);
            var codeMsg = component.find("codeAlert");            
            if (component.isValid() && state1 === "SUCCESS") 
            {                
                var msg1 = response.getReturnValue();  
                console.log(msg1);
                if(msg1 == 'true')
                {
                    $A.util.removeClass(infoPanel2, 'has-error');
                    $A.util.addClass(infoPanel2, 'has-success');
                    this.hide(component, 'codeAlert');
                    this.hide(component,'verificationPanel');
                    this.show(component,'inputForm1');                    
                    msg = 'Success';
                    console.log('msgOutside:'+msg);
                    //Get Certification Details
                    if(msg == 'Success')
                    {
                        var action2 = component.get("c.checkStatus");
                        action2.setParams({ 
                            "email": idd                
                        }); 
                        
                        action2.setCallback(this, function(response) {
                            var state2 = response.getState();  
                            console.log('State2:'+state2);
                            //var codeMsg = component.find("codeAlert");            
                            if (component.isValid() && state2 === "SUCCESS") 
                            {                
                                var lstCertDetails = response.getReturnValue();  
                                console.log('lstCertDetails:'+lstCertDetails); 
                                console.log('Hii');
                                console.log('Associate Email:'+lstCertDetails[0].AssociateId__r.Email__c);
                                if(lstCertDetails != null || lstCertDetails != undefined)
                                {
                                    component.set("v.lstCertDetails",lstCertDetails);  
                                    component.set("v.truthy",true);
                                    console.log('Hii');
                                    console.log('Associate Email:'+lstCertDetails[0].AssociateId__r.Email__c);
                                    var verificationEmail = 'http://certification.salesforce.com/verification-email?init=1&email='+lstCertDetails[0].AssociateId__r.Email__c;
                                    console.log('Verification Email:'+verificationEmail);
                                    component.set("v.verifyAddress",verificationEmail);
                                }
                                else
                                {
                                    component.set("v.btnSubmit", false);
                                    component.set("v.truthy",false);
                                }
                                
                            }
                        }); 
                        $A.enqueueAction(action2);
                    }
                    
                }
                else
                {
                    component.set("v.btnSubmit", false);
                    $A.util.addClass(infoPanel2, 'has-error');
                    codeMsg.set("v.value",'Incorrect Verification Code');
                    this.show(component, 'codeAlert');
                    msg = 'Error';
                }
            }
            else
            {
                component.set("v.btnSubmit", false);
            }
        });
        $A.enqueueAction(action1);
        
        
    }, 
    
    setSelectCetificateValues: function(component)
    {
        (component.find("selectedCertificate")).set("v.value","--Select--");
    },
    setSelectStatus: function(component)
    {
        var opts = [{label: "--Select--", value: "--Select--", selected: "true"},
                    {label: "Completed", value: "Completed" },
                    {label: "Not Completed", value: "Not Completed" },
                    {label: "Planned", value: "Planned" },
                    {label: "Not Applicable", value: "Not Applicable" }
                   ];  
        component.find("selectedStatus").set("v.options", opts);
        $A.util.removeClass(component.find("compDatePanel"), 'has-error');
        $A.util.removeClass(component.find("plannedPanel"), 'has-error');
        //$A.util.removeClass(component.find("certNumPanel"), 'has-error');
    },
    validatedate : function(component, inputText)
    {
        console.log('inputText in helper:'+inputText);
        console.log('inputText.value in helper:'+inputText.value);
        var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;  
        // Match the date format through regular expression  
        if(inputText.match(dateformat))  
        {  
            //document.form1.text1.focus();  
            //Test which seperator is used '/' or '-'  
            var opera1 = inputText.split('/');  
            var opera2 = inputText.split('-');  
            var lopera1 = opera1.length;  
            var lopera2 = opera2.length;  
            // Extract the string into month, date and year  
            if (lopera1>1)  
            {  
                var pdate = inputText.split('/');  
            }  
            else if (lopera2>1)  
            {  
                var pdate = inputText.split('-');  
            }  
            var dd = parseInt(pdate[0]);  
            var mm  = parseInt(pdate[1]);  
            var yy = parseInt(pdate[2]);  
            // Create list of days of a month [assume there is no leap year by default]  
            var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];  
            if (mm==1 || mm>2)  
            {  
                if (dd>ListofDays[mm-1])  
                {  
                    console.log('Invalid date format1!');  
                    return false;  
                }  
            }  
            if (mm==2)  
            {  
                var lyear = false;  
                if ( (!(yy % 4) && yy % 100) || !(yy % 400))   
                {  
                    lyear = true;  
                }  
                if ((lyear==false) && (dd>=29))  
                {  
                    console.log('Invalid date format2!');  
                    return false;  
                }  
                if ((lyear==true) && (dd>29))  
                {  
                    console.log('Invalid date format3!');  
                    return false;  
                }  
            }  
        }  
        else  
        {  
            console.log("Invalid date format4!");  
            //document.form1.text1.focus();  
            return false;  
        }          
    },
    finalSave : function (component, strcertName, strEmail, strStatus, strCompDate, strPlannedDate, strCertNum)
    {
        component.set("v.btnSave", true);
        component.set("v.btnCancel", true);
        var actionFinal = component.get("c.submitFinal");
        actionFinal.setParams({ 
            "certNameStr": strcertName,
            "emailStr": strEmail,
            "StatusStr": strStatus,
            "CompDateStr": strCompDate,
            "PlannedDateStr":strPlannedDate,
            "CertNumStr":strCertNum
        }); 
        
        actionFinal.setCallback(this, function(response) {
            var stateFinal = response.getState();       
            console.log(stateFinal);
            var msg = '';
            if (component.isValid() && stateFinal === "SUCCESS") 
            {
                msg = response.getReturnValue();
                alert('Certification details saved!!');
                //Get Certification Details
                if(msg == 'Success')
                {
                    var emailAdd = (component.find("outputEmail1")).get("v.value");
                    var action2 = component.get("c.checkStatus");
                    action2.setParams({ 
                        "email": emailAdd                
                    }); 
                    
                    action2.setCallback(this, function(response1) {
                        var state2 = response1.getState();  
                        console.log('State2:'+state2);
                        //var codeMsg = component.find("codeAlert");            
                        if (component.isValid() && state2 === "SUCCESS") 
                        {                
                            var lstCertDetails = response1.getReturnValue();  
                            console.log('lstCertDetails:'+lstCertDetails);   
                            if(lstCertDetails != null || lstCertDetails != undefined)
                            {
                                this.hide(component,'inputForm2');
                                this.show(component,'inputForm1');
                                component.set("v.lstCertDetails",lstCertDetails);  
                                component.set("v.truthy",true);                                                               
                                console.log('Associate Email:'+lstCertDetails[0].AssociateId__r.Email__c);
                                var verificationEmail = 'http://certification.salesforce.com/verification-email?init=1&email='+lstCertDetails[0].AssociateId__r.Email__c;
                                console.log('Verification Email:'+verificationEmail);
                                component.set("v.verifyAddress",verificationEmail);
                            }
                            else
                            {
                                this.hide(component,'inputForm3');
                                this.show(component,'inputForm2');
                                component.set("v.truthy",false);
                            }
                            component.set("v.btnSave", false);
                            component.set("v.btnCancel", false);                            
                        }
                    }); 
                    $A.enqueueAction(action2);
                }
                else if(msg == 'Error')
                {
                    component.set("v.btnSave", false);
                    component.set("v.btnCancel", false);
                    console.log(msg);
                }
            }
            else
            {
                component.set("v.btnSave", false);
                component.set("v.btnCancel", false);
            }
        });
        $A.enqueueAction(actionFinal);
        
        
    },
    formatDate: function (component, date1, str)
    {
        var dNew = date1.replace("-", "/");
        var dNew1 = dNew.replace(".", "/");
        console.log('format date input in helper:'+date1)
        var d=new Date(dNew1.split("/").reverse().join("-")); 
        if(str == 'comp')
        {
            var check = this.checkCompDate(component, d);
            if(check == 'Ok')
            {
                var dd=d.getDate();
                var mm=d.getMonth()+1;
                var yy=d.getFullYear();
                console.log(yy+"-"+mm+"-"+dd);
                var d1 = yy+"-"+mm+"-"+dd;
                return d1;   
            }
            else if(check == 'Greater')
            {
                return 'Greater';
            }
        }
        else if(str == 'plan')
        {
            var check1 = this.checkPlanDate(component, d);
            if(check1 == 'Ok')
            {
                var dd1=d.getDate();
                var mm1=d.getMonth()+1;
                var yy1=d.getFullYear();
                console.log(yy1+"-"+mm1+"-"+dd1);
                var d2 = yy1+"-"+mm1+"-"+dd1;
                return d2;   
            }
            else if(check1 == 'Lower')
            {
                return 'Lower';
            }
        }
        
    },
    checkCompDate : function(component, compdateNew)
    {
        var strNew = (compdateNew.getFullYear()+'-'+(compdateNew.getMonth()+1)+'-'+(compdateNew.getDate()));
        var compdateNew1 = new Date(strNew);
        //get today's date to compare
        var d = new Date();
        var dd=d.getDate();
        var mm=d.getMonth()+1;
        var yy=d.getFullYear();
        console.log(yy+"-"+mm+"-"+dd);
        var d2 = yy+'-'+mm+'-'+dd;
        var dateToday = new Date(d2);
        console.log('Completion date entered:'+compdateNew1);
        console.log('Today date:'+dateToday);
        
        //compare date and return msg accordingly
        if(dateToday < compdateNew1)
        {
            console.log('Completion Date must be current or past date');
            return 'Greater';
        }
        else
            return 'Ok';
    },
    checkPlanDate : function(component,plandateNew)
    {
        var strNew = (plandateNew.getFullYear()+'-'+(plandateNew.getMonth()+1)+'-'+(plandateNew.getDate()));
        var plandateNew1 = new Date(strNew);
        //get today's date to compare
        var d = new Date();
        var dd=d.getDate();
        var mm=d.getMonth()+1;
        var yy=d.getFullYear();
        console.log(yy+"-"+mm+"-"+dd);
        var d2 = yy+'-'+mm+'-'+dd;
        var dateToday = new Date(d2);
        console.log('Completion date entered:'+plandateNew1);
        console.log('Today date:'+dateToday);
        
        //compare date and return msg accordingly
        if(dateToday >= plandateNew1)
        {
            console.log('Planned Date must be future date!!');
            return 'Lower';
        }
        else
            return 'Ok';
    },
    checkValidNum : function(component, n)
    {
         var n2 =  (!isNaN(parseFloat(n)) && isFinite(n));
        if(n2)
        {
            var v3 = 0;
            v3 = Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
            console.log(v3);            
            if ((v3 < 5) || (v3>10)) 
            { 
                return 'Between';              
            } 
            else
                return 'Ok';
        }
        else 
            return 'Invalid';
    }
    
})