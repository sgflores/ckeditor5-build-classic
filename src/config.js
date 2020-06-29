/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import AutoSave from '@ckeditor/ckeditor5-autosave/src/autosave';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak';
import Font from '@ckeditor/ckeditor5-font/src/font';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
// Core plugin that provides the API for the management of special characters and thir categories.
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
// A plugin that combines a basic set of special characters.
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';

import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar';
import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';
import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';

// custom plugin
import BackGroundImage from './plugins/background-image-plugin';
import Print from './plugins/print-plugin';

export default class DecoupledEditor extends DecoupledEditorBase {}

// Plugins to include in the build.
DecoupledEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	Indent,
	IndentBlock,
	Link,
	List,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TableProperties, 
	TableCellProperties,
	TextTransformation,
	SimpleUploadAdapter,
	AutoSave,
	PageBreak,
	Font,
	Highlight,
	HorizontalLine,
	SpecialCharacters, 
	SpecialCharactersEssentials,
	Alignment,
	WordCount,
	BlockToolbar, 
	ParagraphButtonUI,
	HeadingButtonsUI,

	// custom plugins
	BackGroundImage,
	Print,
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
	toolbar: {
		items: [
			'print', // custom plugin @plugins/print-plugin.js
			'|',
			'heading',
			'|',
			'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'horizontalLine',
			'specialCharacters',
			'|',
			'alignment',
			'indent',
			'outdent',
			'|',
			'imageUpload',
			'backgroundImage', // custom plugin @plugins/background-image-plugin.js
			'blockQuote',
			'insertTable',
			'undo',
			'redo',
			'|',
			'pageBreak',
		],
        shouldNotGroupWhenFull: true
	},
	blockToolbar: {
		items: [
			'paragraph', 'heading1', 'heading2', 'heading3',
			'|',
			'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight',
			'|',
			'bulletedList', 'numberedList',
			'|',
			'alignment',
			'indent',
			'outdent',
			'|',
			'blockQuote', 'imageUpload'
		],
		shouldNotGroupWhenFull: true
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:alignLeft',
			'imageStyle:alignRight',
			/*'|',
			'imageTextAlternative'*/
		],
		styles: [
			// This option is equal to a situation where no style is applied.
			'full',

			// This represents an image aligned to the left.
			'alignLeft',

			// This represents an image aligned to the right.
			'alignRight'
		],
		resizeUnit: 'px',
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells',
			'tableProperties', 
			'tableCellProperties'
		],
		// Configuration of the TableProperties plugin.
		tableProperties: {
			// ...
		},
		// Configuration of the TableCellProperties plugin.
		tableCellProperties: {
			// ...
		}
	},
	fontSize: {
		options: [
			9,
			11,
			13,
			'default',
			17,
			19,
			21
		],
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en',
};
