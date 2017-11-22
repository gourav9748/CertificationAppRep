({
    
    //method executed at time of loading of component
    doInit : function(component, event, helper){
        helper.show(component, 'inputPanel');
        helper.hide(component, 'verificationPanel');  
        helper.hide(component, 'emailAlert');
        helper.hide(component, 'codeAlert');
        helper.hide(component, 'inputForm1');
        helper.hide(component, 'inputForm2');
        helper.hide(component, 'CertSelectAlert');
        helper.hide(component, 'statusSelectAlert'); 
        helper.hide(component, 'lstStatus'); 
        helper.hide(component, 'completionPanel'); 
        helper.hide(component, 'plannedPanel'); 
        helper.hide(component, 'notCompletedPanel'); 
        helper.hide(component, 'notApplicablePanel');
        helper.hide(component, 'certCompletionDateAlert');
        helper.hide(component, 'certNumAlert');
        helper.hide(component, 'inputPanel');
        helper.hide(component, 'registrationPanel');
        helper.show(component, 'firstPanel');
        //helper.hide(component, 'btnSave');
        component.set("v.btncheckEmail", false);
        component.set("v.btnSubmit", false);
        component.set("v.btnSave", true);
        component.set("v.btnCancel", false);
        component.set("v.btnRegNewUserBack", false);
        component.set("v.btnRegNewUser", false);
        helper.getLoc(component);
        helper.getCertData(component);
    },
    
    // for new user
    newUser: function(component, event, helper) {
        helper.hide(component, 'firstPanel');
        helper.show(component, 'registrationPanel');
        helper.hide(component,'newUserNameAlert');
        helper.hide(component,'newUserEmailAlert');
        helper.hide(component,'newUserIdAlert');
        helper.hide(component,'newUserLocationAlert');
        $A.util.removeClass(component.find("newUserNamePanel"), 'has-error');
        $A.util.removeClass(component.find("newUserIdPanel"), 'has-error');
        $A.util.removeClass(component.find("newUserEmailPanel"), 'has-error');
        $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');
        component.set("v.newUserName", '');
        component.set("v.newUserId", '');
        component.set("v.newUserEmail", '');
        component.set("v.newUserLocation", '');
    },
    backNewUser : function(component, event, helper) {
        helper.show(component, 'firstPanel');
        helper.hide(component, 'registrationPanel');
    },
    
    //register new user method
    registerNewUser :function(component, event, helper) {
        var name = component.get("v.newUserName");
        var id = component.get("v.newUserId");
        var email = component.get("v.newUserEmail");
        var location = component.get("v.newUserLocation");
        console.log('New User Name:'+name);
        console.log('New User Id:'+id);console.log('New User Email:'+email);
        console.log('New User Location:'+location);
        if(name == null || name == '' || name == undefined)
        {
            helper.show(component,'newUserNameAlert');
            $A.util.addClass(component.find("newUserNamePanel"), 'has-error');
            helper.hide(component,'newUserEmailAlert');
            helper.hide(component,'newUserIdAlert');
            helper.hide(component,'newUserLocationAlert');            
            $A.util.removeClass(component.find("newUserIdPanel"), 'has-error');
            $A.util.removeClass(component.find("newUserEmailPanel"), 'has-error');
            $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');
        }
        else if((name != null || name != undefined) && (name != '') )
        {
            helper.hide(component,'newUserNameAlert');
            $A.util.removeClass(component.find("newUserNamePanel"), 'has-error');
            if((id != null || id != undefined) && (id != ''))
            {
                var v3 = 0;
                v3 = Math.max(Math.floor(Math.log10(Math.abs(id))), 0) + 1;
                console.log('digits entered in id:'+v3);            
                if (v3 != 6) 
                {
                    helper.show(component,'newUserIdAlert');
                    $A.util.addClass(component.find("newUserIdPanel"), 'has-error');
                    component.set('v.newUserId','');
                    (component.find('newUserIdAlert')).set("v.value",'Employee Id should be of 6 digits only!!');
                    helper.hide(component,'newUserEmailAlert');
                    helper.hide(component,'newUserLocationAlert');                                
                    $A.util.removeClass(component.find("newUserEmailPanel"), 'has-error');
                    $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');
                }
                //correct id
                else
                {
                    helper.hide(component,'newUserIdAlert');
                    $A.util.removeClass(component.find("newUserIdPanel"), 'has-error');
                    (component.find('newUserIdAlert')).set("v.value",'Please provide Employee Id!!');
                    //email check
                    if((email != null || email != undefined) && (email != ''))
                    {
                        var atpos = email.indexOf("@");
                        var dotpos = email.lastIndexOf(".");
                        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) 
                        { 
                            //Error message in case invalid email
                            helper.show(component,'newUserEmailAlert');
                            $A.util.addClass(component.find("newUserEmailPanel"), 'has-error');
                            helper.hide(component,'newUserLocationAlert');                                                            
                            $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');
                            (component.find('newUserEmailAlert')).set("v.value",'Not a valid email address!!');
                        }
                        else
                        {
                            email = email.toLowerCase();
                            console.log('email in lowercase:'+email);
                            var isOfficialEmail = email.includes("@cognizant.com");
                            console.log('isOfficialEmail:'+isOfficialEmail);
                            if(!isOfficialEmail)
                            {
                                //email not in official format
                                helper.show(component,'newUserEmailAlert');
                                $A.util.addClass(component.find("newUserEmailPanel"), 'has-error');
                                helper.hide(component,'newUserLocationAlert');                                                            
                                $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');
                                (component.find('newUserEmailAlert')).set("v.value",'Not an official email address!!');
                            }
                            else
                            {
                                //In case valid email
                                helper.hide(component,'newUserEmailAlert');
                                $A.util.removeClass(component.find("newUserEmailPanel"), 'has-error');
                                (component.find('newUserEmailAlert')).set("v.value",'Please provide email address!!');
                                if(location == '--Select--')
                                {
                                    //location not selected
                                    helper.show(component,'newUserLocationAlert');                                                            
                                    $A.util.addClass(component.find("newUserLocationPanel"), 'has-error');                                    
                                }
                                else
                                {
                                    //location selected
                                    helper.hide(component,'newUserLocationAlert');                                                            
                                    $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');                                    
                                    //calling helper method to create user record
                                    helper.newUserSubmit(component, name, id, email, location);
                                }
                            }
                        }
                    }
                }
            }
            else if(id == null || id == undefined || id == '')
            {
                helper.show(component,'newUserIdAlert');
                $A.util.addClass(component.find("newUserIdPanel"), 'has-error');
                helper.hide(component,'newUserEmailAlert');
                helper.hide(component,'newUserLocationAlert');                                
                $A.util.removeClass(component.find("newUserEmailPanel"), 'has-error');
                $A.util.removeClass(component.find("newUserLocationPanel"), 'has-error');
            }
        }       
    },
    
    // for already registered user
    regUser: function(component, event, helper) {
        helper.hide(component, 'firstPanel');
        helper.show(component, 'inputPanel');
        var infoPanel1 = component.find("inputPanel");
        $A.util.removeClass(infoPanel1, 'has-error');
        helper.hide(component, 'emailAlert');
        component.set("v.btncheckEmail", false);
        component.set("v.btnBackRegUser", false);
        
        var inEmailField = component.find("inputId");
        inEmailField.set("v.value",'');
    },
    backRegUser : function(component, event, helper) {
        helper.show(component, 'firstPanel');
        helper.hide(component, 'inputPanel');
    },
    
    //method to check id format and presence in Salesforce
    checkEmail1 : function(component, event, helper) {
        //var inEmailField = component.find("inputId");
        var infoPanel1 = component.find("inputPanel");
        var emailMsg = component.find("emailAlert");
        var inId =  (component.find("inputId")).get("v.value");
        console.log(inId);
        if((inId != null || inId != undefined) && (inId != ''))
        {
            var v3 = 0;
            v3 = Math.max(Math.floor(Math.log10(Math.abs(inId))), 0) + 1;
            console.log('digits entered in id:'+v3);            
            if (v3 != 6) 
            {
                //invalid id
                $A.util.addClass(infoPanel1, 'has-error');
                helper.show(component, 'emailAlert');
                emailMsg.set("v.value",'Employee Id must contains 6 digits only!!');
                (component.find("inputId")).set("v.value",'');
            }
            else
            {
                //valid id
                $A.util.removeClass(infoPanel1, 'has-error');
                helper.hide(component, 'emailAlert');
                var msg1 = helper.check(component, inId);
                console.log(msg1);
            }
        }
        else if(inId != null || inId != undefined || inId != '')
        {
            $A.util.addClass(infoPanel1, 'has-error');
            helper.show(component, 'emailAlert');
            emailMsg.set("v.value",'Please enter Employee Id!!');
        }
        /*if((inEmail != null || inEmail != undefined) && (inEmail != ''))
        {
            var atpos = inEmail.indexOf("@");
            var dotpos = inEmail.lastIndexOf(".");
            if (atpos<1 || dotpos<atpos+2 || dotpos+2>=inEmail.length) {                
                
                //Error message in case invalid email
                $A.util.addClass(infoPanel1, 'has-error');
                helper.show(component, 'emailAlert');
                emailMsg.set("v.value",'Not a valid e-mail address');
                console.log("Not a valid e-mail address");
                return false;
            }
            else
            {
                //In case valid email
                console.log('gud');
                component.set("v.btncheckEmail", true);
                $A.util.removeClass(infoPanel1, 'has-error');
                helper.hide(component, 'emailAlert');
                var msg1 = helper.check(component, inEmail);
                console.log(msg1);
                
            }
        }
        else if (inEmail == null || inEmail == undefined || inEmail == '')
        {
            $A.util.addClass(infoPanel1, 'has-error');
            helper.show(component, 'emailAlert');
            emailMsg.set("v.value",'Please enter some value!!');
            helper.show(component, 'emailAlert');
        }*/
        
    },
    
    //method executed when verification code submitted
    Submit : function(component, event, helper) {
        var infoPanel2 = component.find("codePanel");
        var v1 = component.find("vCode1");        
        var codeMsg = component.find("codeAlert");
        var v2 = v1.get("v.value");
        console.log(v2);
        if((v2 != null || v2 != undefined) && v2 != '')        
        {
            var v3 = 0;
            v3 = Math.max(Math.floor(Math.log10(Math.abs(v2))), 0) + 1;
            console.log(v3);            
            if (v3 != 5) { 
                $A.util.addClass(infoPanel2, 'has-error');
                codeMsg.set("v.value",'Verifiction code should be of 5-digits only!!');
                helper.show(component, 'codeAlert'); 
                v1.set('v.value', '');
            } 
            else
            {
                component.set("v.btnSubmit", true);                
                //var inEmailField = component.find("inputEmail");                
                //var inEmail =  inEmailField.get("v.value");
                var inId =  component.find("outputEmail1").get("v.value");
                console.log(inId);
                helper.submit(component, inId, v2.toString());                
                //$A.util.removeClass(infoPanel2, 'has-error');
                //helper.hide(component, 'codeAlert');
            }
        }
        else if(v2 == null || v2 == '' || v2 == undefined)
        {
            $A.util.addClass(infoPanel2, 'has-error');
            codeMsg.set("v.value",'Please provide verification code!!');
            helper.show(component, 'codeAlert');            
        }
        
    },
    
    onSelectCertChange : function(component, event, helper) {
        var selectedCertificate = component.find("selectedCertificate").get("v.value");
        console.log('selectedCertificate:'+selectedCertificate);
        if(selectedCertificate == '--Select--')
        {
            $A.util.addClass(component.find("lstCert"), 'has-error');            
            helper.show(component, 'CertSelectAlert');
            helper.hide(component, 'statusSelectAlert'); 
            helper.hide(component, 'planDateAlert');
            helper.hide(component, 'lstStatus'); 
            helper.hide(component, 'completionPanel'); 
            helper.hide(component, 'plannedPanel'); 
            helper.hide(component, 'notCompletedPanel'); 
            helper.hide(component, 'notApplicablePanel');
            helper.hide(component, 'certCompletionDateAlert');
            helper.hide(component, 'certNumAlert');
            //helper.hide(component, 'btnSave');
            component.set("v.btnSave", true);            
        }
        else
        {
            helper.setSelectStatus(component);
            $A.util.removeClass(component.find("lstStatus"), 'has-error');
            $A.util.removeClass(component.find("lstCert"), 'has-error');
            helper.hide(component, 'CertSelectAlert'); 
            helper.hide(component, 'planDateAlert');
            helper.show(component, 'lstStatus'); 
            helper.hide(component, 'completionPanel'); 
            helper.hide(component, 'plannedPanel'); 
            helper.hide(component, 'notCompletedPanel'); 
            helper.hide(component, 'notApplicablePanel');
            helper.hide(component, 'certCompletionDateAlert');
            helper.hide(component, 'certNumAlert');
            //helper.hide(component, 'btnSave');
            component.set("v.btnSave", true);  
        }
    },
    registerNew : function(component, event, helper) {
        helper.setSelectCetificateValues(component);
        helper.setSelectStatus(component);        
        helper.hide(component, 'CertSelectAlert');
        helper.hide(component, 'planDateAlert');
        $A.util.removeClass(component.find("lstCert"), 'has-error');
        helper.show(component, 'inputForm2'); 
        helper.hide(component, 'inputForm1');
        helper.hide(component, 'statusSelectAlert'); 
        helper.hide(component, 'lstStatus'); 
        helper.hide(component, 'completionPanel'); 
        helper.hide(component, 'plannedPanel'); 
        helper.hide(component, 'notCompletedPanel'); 
        helper.hide(component, 'notApplicablePanel');
        helper.hide(component, 'certCompletionDateAlert');
        helper.hide(component, 'certNumAlert');
        //helper.hide(component, 'btnSave'); 
        component.set("v.btnSave", true);        
        
    },
    cancel : function(component, event, helper) {
        helper.show(component, 'inputForm1'); 
        helper.hide(component, 'inputForm2');    
        
    },
    
    onSelectStatusChange : function(component, event, helper) {
        $A.util.removeClass(component.find("compDatePanel"), 'has-error');
        $A.util.removeClass(component.find("plannedPanel"), 'has-error');
        $A.util.removeClass(component.find("certNumPanel"), 'has-error');
        helper.hide(component, 'certNumAlert');
        helper.hide(component, 'certCompletionDateAlert');
        helper.hide(component, 'planDateAlert');
        component.find("certNum").set("v.value",'');
        component.find("certCompletionDate").set("v.value",'');
        component.find("certPlanDate").set("v.value",'');
        var selectedStatus = component.find("selectedStatus").get("v.value");
        console.log('selectedStatus:'+selectedStatus);
        if(selectedStatus == '--Select--')
        {
            $A.util.addClass(component.find("lstStatus"), 'has-error');  
            helper.show(component, 'statusSelectAlert');
            helper.hide(component, 'completionPanel'); 
            helper.hide(component, 'plannedPanel'); 
            helper.hide(component, 'notCompletedPanel'); 
            helper.hide(component, 'notApplicablePanel'); 
            //helper.hide(component, 'btnSave');
            component.set("v.btnSave", true);
            helper.hide(component, 'compDatePanel');
            helper.hide(component, 'certNumPanel');
            helper.hide(component, 'plannedPanel');
        }
        else if(selectedStatus == 'Completed')
        {
            $A.util.removeClass(component.find("lstStatus"), 'has-error'); 
            helper.hide(component, 'statusSelectAlert');
            helper.show(component, 'completionPanel'); 
            helper.hide(component, 'plannedPanel'); 
            helper.hide(component, 'notCompletedPanel'); 
            helper.hide(component, 'notApplicablePanel'); 
            //helper.show(component, 'btnSave');
            component.set("v.btnSave", false);
            helper.show(component, 'compDatePanel');
            helper.show(component, 'certNumPanel');
            helper.hide(component, 'plannedPanel');
            //helper.show(component, 'btnSave');
        }
            else if(selectedStatus == 'Planned')
            {
                $A.util.removeClass(component.find("lstStatus"), 'has-error'); 
                helper.hide(component, 'statusSelectAlert');
                helper.hide(component, 'completionPanel'); 
                helper.show(component, 'plannedPanel'); 
                helper.hide(component, 'notCompletedPanel'); 
                helper.hide(component, 'notApplicablePanel'); 
                //helper.show(component, 'btnSave');
                component.set("v.btnSave", false);
                helper.hide(component, 'compDatePanel');
                //helper.hide(component, 'certNumPanel');
                helper.show(component, 'plannedPanel');
                //helper.show(component, 'btnSave');
            }
                else if(selectedStatus == 'Not Completed')
                {
                    $A.util.removeClass(component.find("lstStatus"), 'has-error'); 
                    helper.hide(component, 'statusSelectAlert');
                    helper.hide(component, 'completionPanel'); 
                    helper.hide(component, 'plannedPanel'); 
                    helper.show(component, 'notCompletedPanel'); 
                    helper.hide(component, 'notApplicablePanel'); 
                    //helper.show(component, 'btnSave');
                    component.set("v.btnSave", false);
                    helper.hide(component, 'compDatePanel');
                    helper.hide(component, 'certNumPanel');
                    helper.hide(component, 'plannedPanel');
                    //helper.show(component, 'btnSave');
                }
                    else if(selectedStatus == 'Not Applicable')
                    {
                        $A.util.removeClass(component.find("lstStatus"), 'has-error'); 
                        helper.hide(component, 'statusSelectAlert');
                        helper.hide(component, 'completionPanel'); 
                        helper.hide(component, 'plannedPanel'); 
                        helper.hide(component, 'notCompletedPanel'); 
                        helper.show(component, 'notApplicablePanel'); 
                        //helper.show(component, 'btnSave');
                        component.set("v.btnSave", false);
                        helper.hide(component, 'compDatePanel');
                        helper.hide(component, 'certNumPanel');
                        helper.hide(component, 'plannedPanel');
                        //helper.show(component, 'btnSave');
                    }
    },
    Save : function(component, event, helper) {
        var selectedStatus = component.find("selectedStatus").get("v.value");
        var selectedCertificate = component.find("selectedCertificate").get("v.value");
        var cmpCertNum = component.find("certNumAlert");
        var email = component.get("v.outputEmail");
        console.log('Email in save function:'+email);
        if(selectedStatus == 'Completed')
        {
            var compDate = component.find("certCompletionDate").get("v.value"); 
            var certNo = component.find("certNum").get("v.value");
            console.log('certCompletionDate:'+compDate);
            console.log('certNum:'+certNo);
            if(compDate == null || compDate == '' || compDate == undefined)
            {
                $A.util.addClass(component.find("compDatePanel"), 'has-error'); 
                helper.show(component, 'certCompletionDateAlert'); 
                $A.util.removeClass(component.find("certNumPanel"), 'has-error'); 
                helper.hide(component, 'certNumAlert');
            }            
            else if(certNo == null || certNo == '' || certNo == undefined)
            {
                $A.util.removeClass(component.find("compDatePanel"), 'has-error'); 
                helper.hide(component, 'certCompletionDateAlert'); 
                $A.util.addClass(component.find("certNumPanel"), 'has-error'); 
                helper.show(component, 'certNumAlert');
            }
                else if(certNo != null && certNo != '' && certNo != undefined && compDate != null && compDate != '' && compDate != undefined)
                {
                    var validNum = helper.checkValidNum(component, certNo);
                    console.log('Cert Num:'+validNum);
                    if(validNum == 'Between')
                    {
                        $A.util.removeClass(component.find("compDatePanel"), 'has-error'); 
                        helper.hide(component, 'certCompletionDateAlert'); 
                        $A.util.addClass(component.find("certNumPanel"), 'has-error'); cmpCertNum
                        cmpCertNum.set("v.value","Certification Number should be 5-10 digits only!!");
                        helper.show(component, 'certNumAlert');
                    }
                    else if(validNum == 'Invalid')
                    {
                        $A.util.removeClass(component.find("compDatePanel"), 'has-error'); 
                        helper.hide(component, 'certCompletionDateAlert'); 
                        $A.util.addClass(component.find("certNumPanel"), 'has-error'); cmpCertNum
                        cmpCertNum.set("v.value","Invalid Certification Number!!");
                        helper.show(component, 'certNumAlert');
                        
                    }
                        else if(validNum == 'Ok')
                        {
                            $A.util.removeClass(component.find("certNumPanel"), 'has-error');
                            cmpCertNum.set("v.value","Please provide certificate number!!");
                            helper.hide(component, 'certNumAlert');                       
                            var validCompDate = helper.validatedate(component,compDate);
                            var cmpCompDate = component.find("certCompletionDateAlert");
                            console.log('Completion Date Valid:'+validCompDate);
                            if(validCompDate == false)
                            {
                                $A.util.addClass(component.find("compDatePanel"), 'has-error'); 
                                helper.show(component, 'certCompletionDateAlert'); 
                                $A.util.removeClass(component.find("certNumPanel"), 'has-error');
                                cmpCompDate.set("v.value","Invalid Date!!");
                                helper.hide(component, 'certNumAlert');
                            }
                            else
                            {
                                var finalCompDate = helper.formatDate(component, compDate, 'comp');
                                if(finalCompDate == 'Greater')
                                {
                                    $A.util.addClass(component.find("compDatePanel"), 'has-error'); 
                                    helper.show(component, 'certCompletionDateAlert'); 
                                    $A.util.removeClass(component.find("certNumPanel"), 'has-error');
                                    cmpCompDate.set("v.value","Completion Date must be current or past date!!");
                                    helper.hide(component, 'certNumAlert');
                                }
                                else
                                {
                                    cmpCompDate.set("v.value","Please provide completion date!!");
                                    $A.util.removeClass(component.find("compDatePanel"), 'has-error'); 
                                    helper.hide(component, 'certCompletionDateAlert'); 
                                    $A.util.removeClass(component.find("certNumPanel"), 'has-error'); 
                                    helper.hide(component, 'certNumAlert');                
                                    console.log('Execute Action:');                            
                                    helper.finalSave(component, selectedCertificate, email, selectedStatus, finalCompDate, '', certNo);
                                }
                            }
                            
                        }
                }
        }
        else if(selectedStatus == 'Planned')
        {
            var cmpPlanDateAlert = component.find("planDateAlert");
            var planDate = component.find("certPlanDate").get("v.value"); 
            console.log(planDate);
            if(planDate == null || planDate == '' || planDate == undefined)
            {
                $A.util.addClass(component.find("plannedPanel"), 'has-error'); 
                helper.show(component, 'planDateAlert');                
            }
            else
            {
                var validPlanDate = helper.validatedate(component,planDate);
                if(validPlanDate == false)
                {
                    $A.util.addClass(component.find("plannedPanel"), 'has-error'); 
                    helper.show(component, 'planDateAlert'); 
                    cmpPlanDateAlert.set("v.value","Invalid Date!!" );
                }
                else
                {
                    var finalPlanDate = helper.formatDate(component, planDate, 'plan');
                    if(finalPlanDate == 'Lower')
                    {
                        $A.util.addClass(component.find("plannedPanel"), 'has-error'); 
                        helper.show(component, 'planDateAlert'); 
                        cmpPlanDateAlert.set("v.value","Planned Date must be future date!!" );
                    }
                    else
                    {
                        $A.util.removeClass(component.find("plannedPanel"), 'has-error'); 
                        helper.hide(component, 'planDateAlert'); 
                        cmpPlanDateAlert.set("v.value","Please provide planned date!!" );                    
                        helper.finalSave(component, selectedCertificate, email, selectedStatus, '', finalPlanDate ,'');
                    }
                }
            }
        }
            else if(selectedStatus == 'Not Completed' || selectedStatus == 'Not Applicable')
            {
                helper.finalSave(component, selectedCertificate, email, selectedStatus, '', '' ,'');                
            }
    }
    
})