@isTest
public class TestCertificationCtrl {
    
     static testMethod void validatenewUserReg() {
         
         Associates__c testAssoc = new Associates__c();
         testAssoc.Name__c = 'TestUser';
         testAssoc.Emp_Id__c = String.valueOf('123456');
         testAssoc.Email__c = 'testUser@cognizant.com';
         testAssoc.usrLocation__c = 'a0P2800000Afny0';
         
         CertificateMaster__c testCert = new CertificateMaster__c();
         testCert.Name = 'testCertificate';
         
         CertificateMaster__c testCert1 = new CertificateMaster__c();
         testCert1.Name = 'testCertificate1';
         
         Location__c testLoc = new Location__c();
         testLoc.Name = 'testLocation';
         
         Test.startTest();
         insert testAssoc;
         List<Associates__c> lsttest = [Select Id, Name__c, Email__c from Associates__c where Name__c = 'TestUser'];
         String id1 = lsttest[0].Id;
         String email = lsttest[0].Email__c;
         system.debug('id1:'+id1);
        
         CertificationDetailsCtrl.getLocations();
         CertificationDetailsCtrl.getCertificates();
         insert testCert;
         insert testCert1;
         
         List<CertificateMaster__c> lst1 = [Select Id from CertificateMaster__c where Name = 'testCertificate'];
         String id2 = lst1[0].Id;
         system.debug('id2:'+id2);
         
         List<CertificateMaster__c> lst2 = [Select Id from CertificateMaster__c where Name = 'testCertificate1'];
         String id3 = lst2[0].Id;
         system.debug('id3:'+id3);
         
         Certificate__c newcert = new Certificate__c();
         newcert.AssociateId__c = id1;
         newcert.CertName__c = id2;
         newcert.Status__c = 'Not Completed';
         insert newcert;
         system.debug('newCertEmail:'+newcert.AssociateId__r.Email__c);
         insert testLoc;          
         CertificationDetailsCtrl.newUserReg('TestUser', '123456', 'testUser@cognizant.com', 'a0P2800000Afny0');
         CertificationDetailsCtrl.checkSubmit('123456', '12345');
         CertificationDetailsCtrl.newUserReg('TestUser', '123458', 'testUser@cognizant.com', 'a0P2800000Afny0');
          CertificationDetailsCtrl.submitFinal(id3, email, 'Not Completed', '', '', '');
         CertificationDetailsCtrl.submitFinal(id2, email, 'Not Completed', '', '', '');
         CertificationDetailsCtrl.submitFinal(id2, 'testUser@cognizant.com', 'Not Applicable', '', '', '');
         CertificationDetailsCtrl.checkId('123456');
         CertificationDetailsCtrl.checkId('123457');
         CertificationDetailsCtrl.getLocations();
         CertificationDetailsCtrl.getCertificates();
         CertificationDetailsCtrl.checkStatus('testUser@cognizant.com');
         CertificationDetailsCtrl.checkStatus('testUser1@cognizant.com');
         CertificationDetailsCtrl.newUserReg('TestUser2', '123457', 'testUser2@cognizant.com', 'a0P2800000Afny0');
         delete testAssoc;
         delete testCert; 
         delete testLoc;         
         Test.stopTest();
         
     }


}