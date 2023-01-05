/*eslint disable no undef*/
// 上方这一行用于eslint的忽略，因为下方代码的指向其实是不存在的，在有eslint的环境中不加入此行会报错
if (window.__POWERED_BY_QIANKUN__) {
	__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
