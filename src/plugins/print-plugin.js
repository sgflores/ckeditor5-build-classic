// based on print sample @https://ckeditor.com/docs/ckeditor5/latest/features/page-break.html// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/creating-simple-plugin.html

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// This SVG file import will be handled by webpack's raw-text loader.
// This means that imageIcon will hold the source SVG.
import printIcon from '../assets/print-button.svg';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class Print extends Plugin {
    init() {

        console.log( 'Print was initialized' );

        const editor = this.editor;

        // inserted @DecoupledEditor.defaultConfig.toolbar.items
        editor.ui.componentFactory.add( 'print', locale => {

            const view = new ButtonView( locale );

            view.set( {
                label: 'Print',
                icon: printIcon,
                tooltip: true
            } );

            // Callback executed once the button is clicked.
            view.on( 'execute', () => {

                var title = '<title></title>';
                // sample 
                // var style = '../src/assets/content-styles.css';
                // able webapp 
                var style = './CKEditor5/src/assets/content-styles.css';
                var css = `<link rel="stylesheet" href="${style}" type="text/css" media="print">`;
                var body = editor.getData();
                var print = '<script>window.addEventListener( "DOMContentLoaded", () => { window.print(); } );</script>';
                
                // ifram #markdownPreview was initialized @DecoupledEditor.razor
                document.getElementById('markdownPreview').srcdoc = `<html><head>${title}${css}</head><body class="ck-content">${body}${print}</body></html>`;

            });

            return view;
        });
    }
}