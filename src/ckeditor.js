import DecoupledEditor from './config.js';

// The official CKEditor 5 inspector provides rich debugging tools for editor internals like model, view, and commands.
// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/development-tools.html#ckeditor-5-inspector
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

window.DecoupledCKEditor = (() => {
    
    const editors = {};

    return {
        init(id, dotNetReference, apiURL, isReadOnly, isInDevelopment) {
            DecoupledEditor
                .create(document.querySelector('.document-editor__editable'), {
                    // simpleuploadadapter plugin
                    simpleUpload: {
                        // The URL that the images are uploaded to.
                        uploadUrl: apiURL,

                        // Headers sent along with the XMLHttpRequest to the upload server.
                        headers: {

                        }
                    },
                    // autosave plugin
                    autosave: {
                        waitingTime: 1000, // in ms
                        save(editor) {

                            var selectedSectionData = window.DecoupledCKEditor.getSelectedSectionData(editor);

                            // console.log(selectedSectionData);

                            if (dotNetReference !== undefined) {

                                dotNetReference.invokeMethodAsync('EditorDataChanged', selectedSectionData.id, selectedSectionData.data);

                                console.log('saving markdown...');
                            }

                        }
                    },
                })
                .then(editor => {
                    const toolbarContainer = document.querySelector('.document-editor__toolbar');

                    toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                    const wordCountPlugin = editor.plugins.get( 'WordCount' );
                    const wordCountWrapper = document.getElementById( 'word-count' );
            
                    wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer );

                    // The official CKEditor 5 inspector provides rich debugging tools for editor internals like model, view, and commands.
                    // https://ckeditor.com/docs/ckeditor5/latest/framework/guides/development-tools.html#ckeditor-5-inspector
                    if (isInDevelopment) {
                        CKEditorInspector.attach( editor );
                    }

                    editor = window.DecoupledCKEditor.allowElementsAndAttributes(editor);

                    editor.isReadOnly = isReadOnly;

                    editor.model.document.on('change:data', () => {

                        // var data = editor.getData();

                        // console.log(data);

                    });
                    
                    editors[id] = editor;

                    // console.log(editors);

                })
                .catch(err => {
                    console.error(err);
                });
        },
        allowElementsAndAttributes(editor) {

            // ref: https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_conversion_conversion-Conversion.html#function-attributeToAttribute
            // ref: https://github.com/ckeditor/ckeditor5/issues/1314
            // ref: https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/schema.html
        
            // add element in schema.
            let allowedElements = [
                'div', 'section', 'span',
            ];

            // allow attributes in schema
            // https://github.com/ckeditor/ckeditor5/issues/4517
            let allowedAttributes = [
                'id', 'class', 'title', 'style',
                'width', 'target', 'name', 'title', 'type', 'align',
                'border', 'cellspacing', 'cellpadding', 'color', 'valign', 'clear', 'src', 'height', 'shapes', 
                'prefix', 'tagtype', 'datetime', 'cols', 'colspan',
                'shape', 'start', 'bgcolor', 'alt', 'strong', 'onclick', 'files', 'rowspan', 'span', 'page', 'content',
                'action', 'method', 'value', 'autofocus', 'maxlength', 'rows', 'aria-label', 'checked', 'selected', 'rel', 'cellpacing', 'block-id', 'guid', 'nowrap', 
                'original-style', 'property', 'controls', 'controlslist', 'data-attr', 'poster', 'preload', 'itemprop', 'tabindex', 'role', 'aria-describedby', 'aria-disabled',
                'onmouseover', 'onmouseout', 'onmouseup', 'col',
            ];
            
            allowedElements.forEach(function (el) {
                // register new Elements
                editor.model.schema.register(el, {
                    allowWhere: '$block',
                    allowContentOf: '$root',
                });
                // convert new elements
                editor.conversion.elementToElement({ model: el, view: el });
        
                // allow attributes to new elements
                editor.model.schema.extend(el, { allowAttributes: allowedAttributes });

                // https://ckeditor.com/docs/ckeditor5/latest/framework/guides/architecture/editing-engine.html
                // setup conversions on allowedAttributes
                allowedAttributes.forEach(function (attr) {

                    /**
                     * Loading the data to the editor.
                        First, the data (e.g. an HTML string) is processed by a DataProcessor to a view DocumentFragment. Then, this view document fragment is converted to a model document fragment. Finally, the model document’s root is filled with this content.
                    */
                    editor.conversion.for('upcast').attributeToAttribute({ model: { name: el, key: attr }, view: attr });

                    /**
                     * Retrieving the data from the editor.
                        First, the content of the model’s root is converted to a view document fragment. Then this view document fragment is processed by a data processor to the target data format.
                    */
                    editor.conversion.for( 'downcast' ).add( dispatcher => {
                        dispatcher.on( `attribute:${attr}:${el}`, ( evt, data, conversionApi ) => {
                            const viewElement = conversionApi.mapper.toViewElement( data.item );
                            conversionApi.writer.setAttribute( attr, data.attributeNewValue, viewElement );
                        } );
                    } );

                });
        
            });

            // CKEditor's generic items
            // var genericItems = ['$root', '$block', '$text'];
            // var definitions = editor.model.schema.getDefinitions();
            // console.log(editor.model.schema);
        
            return editor;
                
        },
        setData(id, dotNetReference, data) {
            // console.log(editors[id]);
            editors[id].setData(data);
            // console.log(editors[id].getData());
        },
        getData(id, dotNetReference, data) {
            // console.log(editors[id].getData());
            return editors[id].getData();
        },
        getSelectedSectionData(editor) {
            var data = editor.getData();

            // console.log(data);
            
            // console.log(editor.model);
            var selection = editor.model.document.selection.getFirstPosition();
            var position = selection.path.length >= 0 ? selection.path[0] : 0;
            var nodes = selection.root._children._nodes;
            var node = nodes[position];
            var classId = node.getAttribute('class');

            // refer to ProposalSharedService@RecursiveLoadMarkdownValuesFromContents for classId locators
            var startLocator = '<div class="'+classId+'">';
            var endLocator = startLocator.replace('start_', 'end_');
            console.log('locator: ', startLocator+' '+endLocator);
            var currentSection = data.match(startLocator + "(.*)" + '</div>' + endLocator);
            var currentSectionData = currentSection !== null ? currentSection[1] : data;
                        
            console.log('rawData: ', data);
            console.log('currentSectionId: ', classId);
            console.log('currentSection: ', currentSection);
            console.log('currentSectionData: ', currentSectionData);


            /*for ( const range of editor.model.document.selection.getRanges() ) {
                console.log(range);
            }*/

            return {
                id: classId,
                data: currentSectionData
            };
        },
        destroy(id) {
            editors[id].destroy()
                .then(() => delete editors[id])
                .catch(error => console.log(error));
        }
    };
})();