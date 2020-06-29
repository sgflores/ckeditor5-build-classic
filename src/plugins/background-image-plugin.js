// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/creating-simple-plugin.html

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// This SVG file import will be handled by webpack's raw-text loader.
// This means that imageIcon will hold the source SVG.
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class BackgroundImage extends Plugin {
    init() {

        console.log( 'BackgroundImage was initialized' );

        const editor = this.editor;

        // inserted @DecoupledEditor.defaultConfig.toolbar.items
        editor.ui.componentFactory.add( 'backgroundImage', locale => {

            const view = new ButtonView( locale );

            view.set( {
                label: 'Set As Background Image',
                icon: imageIcon,
                tooltip: true
            } );

            // Callback executed once the button is clicked.
            view.on( 'execute', () => {

                var selection = editor.model.document.selection;

                var selectedElement = selection.getSelectedElement();

                if (!selectedElement || selectedElement.name != 'image') {
                    alert('Please select an image from the document');
                    return;
                }

                // console.log(selectedElement);

                var srcUrl = selectedElement.getAttribute('src');
                var imageWidth = selectedElement.getAttribute('width'); // by pixels configured @config.js/image
                var imageStyle = selectedElement.getAttribute('imageStyle');

                var backgroundSize = 'min-height: 300px;';
                if (imageWidth) {
                    backgroundSize = `min-height: ${imageWidth}; background-size: ${imageWidth} ${imageWidth};`;
                }

                var backgroundPosition = 'background-position: top;';
                if (imageStyle) {
                    var position = 'top';
                    position = imageStyle == 'alignLeft' ? 'left' : imageStyle == 'alignRight' ? 'right' : 'top';
                    backgroundPosition = `background-position: ${position};`;
                }

                
                // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_model-Model.html#function-insertContent

                // Let's create a document fragment containing such content as:
                //
                // <div style="background-image: url(); background-repeat: no-repeat;  background-position:top; min-height:10px;">
                //      <p>  "space" </p>
                // </div>
                const docFrag = editor.model.change(writer => {

                    const backgroundDiv = writer.createElement( 'div', {
                        style: `background-image: url(${srcUrl}); background-repeat: no-repeat; ${backgroundPosition} ${backgroundSize}`, 
                    });

                    const p1 = writer.createElement( 'paragraph' );
                    const docFrag = writer.createDocumentFragment();
                
                    writer.append( backgroundDiv, docFrag );
                    writer.append( p1, backgroundDiv ); 
                    // insert a space or an empty content so that the newly created backgroundDiv is still editable encase no other content is present
                    writer.insertText( ' ', p1 );
                                 
                    // writer.remove(selectedElement);

                    return docFrag;

                });

                editor.model.insertContent( docFrag, editor.model.document.selection );

            });

            return view;
        });
    }
}