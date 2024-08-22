import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import fetchFileContent from '@salesforce/apex/DownloadFunctionality.fetchFile';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FileDownloadComponent extends NavigationMixin(LightningElement) {
    docId;

    handleInput() {
        this.docId = this.template.querySelector('[data-id="file_id"]').value;
        console.log('docId', this.docId);
    }
    
    handleDownloadClick() {
        console.log('Getting the docId', this.docId);
        fetchFileContent({ fileId: this.docId })
            .then(result => {
                if (result && result.length > 0) {
                    result.forEach(fileId => {
                        let filesDownloadUrl = `/sfc/servlet.shepherd/version/download/${fileId}`;
                        console.log('filesDownloadUrl is:', filesDownloadUrl);
                        
                        // Open the URL in a new tab or window
                        window.open(filesDownloadUrl, '_blank');
                    });

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'File Download',
                            message: 'Files Download Successfully!!',
                            variant: 'success'
                        })
                    );
                } else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'File Download',
                            message: 'File Download Failed!!',
                            variant: 'error'
                        })
                    );
                }
            })
            .catch(error => {
                console.log('error==>', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'File Download',
                        message: 'An error occurred during the download process.',
                        variant: 'error'
                    })
                );
            });
    }
}
