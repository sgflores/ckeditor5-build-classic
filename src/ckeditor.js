import DecoupledEditor from './config.js';

window.DecoupledCKEditor = (() => {
    
    const editors = {};

    return {
        init(id, dotNetReference, apiURL, isReadOnly) {
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
                            }

                            console.log('saving markdown...');
                        }
                    },
                })
                .then(editor => {
                    const toolbarContainer = document.querySelector('.document-editor__toolbar');

                    toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                    const wordCountPlugin = editor.plugins.get( 'WordCount' );
                    const wordCountWrapper = document.getElementById( 'word-count' );
            
                    wordCountWrapper.appendChild( wordCountPlugin.wordCountContainer );

                    editor = window.DecoupledCKEditor.allowElementsAndAttributes(editor);

                    editor.isReadOnly = isReadOnly;

                    editor.model.document.on('change:data', () => {

                        // var data = editor.getData();

                        // console.log(data);

                    });

                    // editor.setData("<div class='section_xxx'> xxx <p> test 123 yyy</p> test lll</div><div class='section_xxx'></div><div class='section_yyy'> this is yyy</div><div class='section_123'>span here</div>");

                    // var data = editor.getData();

                    // console.log(data.match('<div class="section_xxx">' + "(.*)" + '</div><div class="section_xxx">'));

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
                'div', 'span',
            ];
            // allow attributes in schema
            let allowedAttributes = [
                'id', 'class', 'title', 'style'
            ];
            allowedElements.forEach(function (el) {
                editor.model.schema.register(el, {
                    /*inheritAllFrom: el == 'templatecontentsection' ? ['$root'] : ['$block'],
                    allowContentOf: ['$text'],
                    isBlock: el == 'templatecontentsection' ? true : false*/
                    allowWhere: '$block',
                    allowContentOf: '$root',
                });
                // convert elements
                editor.conversion.elementToElement({ model: el, view: el });

                // convert elements
                editor.conversion.elementToElement({ model: el, view: el });
                // allow attributes
                editor.model.schema.extend(el, { allowAttributes: allowedAttributes });

                allowedAttributes.forEach(function (attr) {
                    // convert attributes
                    editor.conversion.attributeToAttribute({ model: { name: el, key: attr }, view: attr });
                });

            });

            // CKEditor's generic items
            // var genericItems = ['$root', '$block', '$text'];
            // var definitions = editor.model.schema.getDefinitions();
            console.log(editor.model.schema);

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

            console.log('classId: ', classId);
            
            var locator = '<div class="'+classId+'">';
            var currentSection = data.match(locator + "(.*)" + '</div>' + locator);

            console.log('currentSection: ', currentSection);
            // console.log('regEx: ', locator + "(.*)" + '</div>' + locator);

            // console.log(data);

            return {
                id: classId,
                data: currentSection !== null ? currentSection[1] : data
            };
        },
        destroy(id) {
            editors[id].destroy()
                .then(() => delete editors[id])
                .catch(error => console.log(error));
        }
    };
})();