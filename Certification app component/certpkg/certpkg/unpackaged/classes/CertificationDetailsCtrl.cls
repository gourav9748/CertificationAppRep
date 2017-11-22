public class CertificationDetailsCtrl {
    
    
    //insert new user record
    @AuraEnabled
    public static string newUserReg(String name, String idnew, String Email, String Location)
    {
        String msg = '';
        try
        {
            List<Associates__c> lstExistingUser = [Select Id, Name__c, Emp_Id__c, Email__c from Associates__c LIMIT 1000];
            if(lstExistingUser != null && lstExistingUser.size()>0)
            {
                for(Associates__c usr: lstExistingUser)                    
                {
                    if(usr.Emp_Id__c == String.valueOf(idnew))
                    {
                        msg = 'Duplicate Id';
                    }
                    else if(usr.Email__c == Email)
                    {
                        msg = 'Duplicate Email';
                    }                   
                }
            }
            if(msg == '')
            {
                List<Associates__c> lstUser = new List<Associates__c>();
                Associates__c newUser = new Associates__c();
                newUser.Name__c = name;
                newUser.Emp_Id__c = String.valueOf(idnew);
                newUser.Email__c = Email;
                newUser.usrLocation__c = Location;
                String str = string.valueof(Math.abs(Crypto.getRandomLong()));
                String randomNumber = str.substring(0, 5);
                //system.debug('Random Number-' + randomNumber);
                newUser.Verification_Code__c = randomNumber;
                lstUser.add(newUser);
                insert lstUser;
                return 'true';
            }
            else return msg;
        }
        catch(Exception e)
        {
            //System.debug('Exception:'+e);   
            return e.getMessage();
        }
        
    }
    
    //get certification list
    @AuraEnabled
    public static List<CertificateMaster__c> getCertificates()
    {
        String query = 'Select Id, Name from CertificateMaster__c';
        List<CertificateMaster__c> lstCertificate = Database.query(query);
        if(lstCertificate != null && lstCertificate.size()>0)
        {  
            /*List<String> lstNames = new List<String>();
            for(Location__c l:lstLocations)
            {
                lstNames.add(l.Name__c);
            }*/
            return lstCertificate;
        }
        else
            return null;
    }
    
    
    //get locations
    @AuraEnabled
    public static List<Location__c> getLocations()
    {
        String query = 'Select Id, Name from Location__c';
        List<Location__c> lstLocations = Database.query(query);
        if(lstLocations != null && lstLocations.size()>0)
        {  
            /*List<String> lstNames = new List<String>();
            for(Location__c l:lstLocations)
            {
                lstNames.add(l.Name__c);
            }*/
            return lstLocations;
        }
        else
            return null;
    }
    
    @AuraEnabled
    public static List<Associates__c> checkId(String strId1)
    {
        String strId2 = String.ValueOf(strId1);
        System.debug('Input Id:'+strId2);
        String query = 'Select Id, Name__c, Email__c, Emp_Id__c, Verification_Code__c from Associates__c where Emp_Id__c =: strId2';
        List<Associates__c> lstAssociate = Database.query(query);
        if(lstAssociate.size() == 1)
        {
            Integer len = 5;
            String str = string.valueof(Math.abs(Crypto.getRandomLong()));
            String randomNumber = str.substring(0, len);
            system.debug('Random Number-' + randomNumber);
            try
            {
                lstAssociate[0].Verification_Code__c = randomNumber;
                Boolean check = sendEmail(lstAssociate[0].Name__c, lstAssociate[0].Email__c, randomNumber);
                System.debug('Check:'+check);
                if(check)
                {
                    update lstAssociate;
                    return lstAssociate;
                }
                else
                    return null;
            }
            catch(Exception e)
            {
                system.debug('Exception' + e);
                return null;
            }           
        }
        else
            return null;
    }
    
    //check certification status
    @AuraEnabled
    public static List<Certificate__c> checkStatus(String email)
    {
        String strId = String.valueOf(email);
        String Query = 'Select Id, Status__c, AssociateId__r.Email__c, CertName__r.Name, Planned_Date__c,Completion_Date__c From Certificate__c where AssociateId__r.Emp_Id__c =: strId';
        List<Certificate__c> lstCertDetails = Database.Query(Query);
        if(lstCertDetails != null && lstCertDetails.size() > 0)
        {
            return lstCertDetails;
        }
        else
        {
            return null;
        }
    }
    //Send Email
    public static Boolean sendEmail(String name, String toEmail, String randomNum)
    {           
        List<String> lstToEmail = new List<String>();
        lstToEmail.add(toEmail);
        System.debug('ToEmail:'+lstToEmail);
        if(lstToEmail.size()>0)
        {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();                
            //lstToEmail.add('rahugup72@gmail.com');
            //mail.setReplyTo('rahugup72@gmail.com');
            EmailTemplate Noti_TempId_notify = [SELECT Id, body, HtmlValue, subject FROM EmailTemplate WHERE Name = 'AssociateCode'];
            User usr = [Select Id from USER where Id ='00528000000LT0o'];
            List<Contact> con = [Select Id, Email from Contact where Id = '0032800000OJ8W8'];
            if(con.size() == 1)
            {
                system.debug('Contact loop:'+con[0].Email);
                lstToEmail.add(con[0].Email);
            }
            String emailBody = Noti_TempId_notify.body;
            emailBody = emailBody.replace('[UserName]', 'Rahul');
            emailBody = emailBody.replace('[verificationCode]','12345');           
            mail.setPlainTextBody(emailBody);
            mail.setTargetObjectId(con[0].Id);
            mail.setToAddresses(lstToEmail);
            mail.setTreatTargetObjectAsRecipient(false);
            mail.setSubject(Noti_TempId_notify.subject);       
            mail.saveAsActivity = true; 
            try
            {
                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail }); 
                System.debug('Email Sent:'+Limits.getEmailInvocations());
                System.debug('Email Limit:'+Limits.getLimitEmailInvocations());
                return true;          
            }
            catch(Exception e)
            {
                system.debug('inside Email Send exception -------'+e);
                return false;
            }
        }
        return false;
        
    }
    
    @AuraEnabled
    public static String submitFinal(String certNameStr, String emailStr, String StatusStr, String CompDateStr, String PlannedDateStr, String CertNumStr)
    {
        //System.debug(certNameStr);
        //System.debug(emailStr);
        //System.debug(StatusStr);System.debug(CompDateStr);System.debug(PlannedDateStr);System.debug(CertNumStr);
        String query1 = 'Select Id, Name__c, Email__c, Verification_Code__c from Associates__c where Email__c =: emailStr';
        List<Associates__c> lstAssociate = Database.query(query1);
        System.debug('lstAssociate1:'+lstAssociate);
        if(lstAssociate != null && lstAssociate.size() == 1)
        {
            String userId = lstAssociate[0].Id;
            try
            {
                String query2 = 'Select Id, AssociateId__c, CertName__c, CertName__r.Name, Status__c, Certificate_Number__c, Completion_Date__c, Planned_Date__c from Certificate__c where AssociateId__c =:userId and CertName__c =:certNameStr';
                List<Certificate__c> lstnewDetails = Database.query(query2);
                if(lstnewDetails != null && lstnewDetails.size()==1)
                {
                    System.debug('record already present');          
                    lstnewDetails[0].CertName__c = certNameStr;                 
                    if(CompDateStr != null && CompDateStr !='')
                        lstnewDetails[0].Completion_Date__c = Date.valueOf(CompDateStr);         
                    else
                        lstnewDetails[0].Completion_Date__c = null;
                    if(PlannedDateStr != null && PlannedDateStr != '')
                        lstnewDetails[0].Planned_Date__c = Date.valueOf(PlannedDateStr);
                    else
                        lstnewDetails[0].Planned_Date__c = null;
                    lstnewDetails[0].Status__c = StatusStr;
                    upsert lstnewDetails;
                    return 'Success';
                }
                else if(lstnewDetails != null && lstnewDetails.size()==0)
                {
                    System.debug('record not present');
                    Certificate__c newCert = new Certificate__c();
                    
                    newCert.AssociateId__c = userId;
                    newCert.CertName__c = certNameStr;                    
                    newCert.Certificate_Number__c = CertNumStr;           
                    if(CompDateStr != null && CompDateStr !='')
                        newCert.Completion_Date__c = Date.valueOf(CompDateStr); 
                    else
                        newCert.Completion_Date__c = null;
                    if(PlannedDateStr != null && PlannedDateStr != '')
                        newCert.Planned_Date__c = Date.valueOf(PlannedDateStr);
                    else
                        newCert.Planned_Date__c = null;
                    newCert.Status__c = StatusStr;
                    insert newCert;  
                    return 'Success';
                }
                else 
                    return 'Error';                
            }
            catch(Exception e)
            {
                system.debug('submit Final exception -------'+e);
                return 'Error';
            }
        }
        else
            return 'Error';
    }
    
    @AuraEnabled
    public static String checkSubmit(String id3, String code1)
    {
        String strId = String.valueOf(id3);
        System.debug('id:'+strId);
        System.debug('code1:'+code1);
        String query1 = 'Select Id, Name__c, Email__c, Emp_Id__c, Verification_Code__c from Associates__c where Emp_Id__c =: strId AND Verification_Code__c =: code1';
        List<Associates__c> lstAssociate = Database.query(query1);
        System.debug('lstAssociate:'+lstAssociate);
        if(lstAssociate != null && (lstAssociate.size() == 1))
        {
            return 'true';
        }
        else
            return 'false';
    }
}