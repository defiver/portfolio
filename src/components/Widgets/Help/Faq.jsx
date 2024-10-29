import { Collapse } from "antd";

export default function FAQ() {
	const items = [
		{
			key: "about",
			label: "Что это?",
			children: <p>Это небольшое веб-приложение для учёта позиций в DeFi. Оно представляет из себя обычную html страницу, которую при желании можно сохранить и запускать локально. Исходный код выложен на <a href="https://github.com/defiver/portfolio">Github</a>. Приложение не оптимизировано для смартфонов, но работать в горизонтальном положении экрана можно. Приложение находится в альфа версии, поэтому может сбоить, изменяться и дополняться. По всем вопросам и предложениям можно писать в чат <a href="https://t.me/defiver_chat">@defiver_chat</a> или в личные сообщения <a href="https://t.me/norit0">@norit0</a>.</p>,
		},
		{
			key: "safety",
			label: "А безопасно ли это?",
			children: <p>Да, приложение не требует никакой чувствительной информации, а все данные, которые вы загружаете и вносите в формы, хранятся только в вашем браузере <i>(их можно посмотреть в меню разработчика во вкладке Хранилище/Application в базе данных IndexedDB)</i>.</p>,
		},
		{
			key: "journal",
			label: "Что на центральной панели?",
			children: <p>Это журнал ваших позиций. Через форму можно вносить основные данные: описание, время открытия и закрытия, ссылки транзакций и пула, теги <i>(uniswap, pendle)</i>, сеть, тикер из списка ваших токенов на правой панели, прибыль <i>(поле <code>Доход</code>)</i>, статус <i>(при его изменении на <code>Завершённая</code> позиция попадает в архив)</i>. В шапке панели есть форма для фильтрации записей в журнале.</p>,
		},
		{
			key: "tokens",
			label: "Что за правая панель?",
			children: <p>Это список ваших активов <i>(тикер, сколько всего/сколько свободно, сумма в долларах, текущая цена, изменение цены)</i>. Котировки берутся с сайта cryptorank.io. В шапке панели отображается общая долларовая стоимость всех активов и сколько всего долларов заработано <i>(сумма полей <code>Доход</code> из вашего журнала позиций)</i>. Также есть форма для расчёт цены произвольного кол-ва токенов.</p>,
		},
		{
			key: "widgets",
			label: "Что за значок слева снизу?",
			children: <p>Нажатие на него вызывает окно с виджетами, которые можно отправлять на главную страницу.</p>,
		},
		{
			key: "notes",
			label: "Что за значок блокнота?",
			children: <p>Нажатие на него вызывает панель для ведения заметок.</p>,
		},
		{
			key: "tools",
			label: "Что за значок приложений?",
			children: <p>Нажатие на него вызывает панель с основными инструментами, которые могут пригодиться новичку в DeFi. Это мосты, биржи, заправки и т.д. Для каждого сервиса есть краткое описания и ссылки на сайт и соцсети. Инструменты можно фильтровать по сетям, а также добавлять в избранное.</p>,
		},
		{
			key: "pools",
			label: "Что за значок с графиком?",
			children: <p>Нажатие на него вызывает панель для отслеживания цены в биржевых пулах и проверки, не вышла ли она из диапазона <i>(для этого необходимо ввести адрес контракта пула, сеть и границы диапазона)</i>. Данные берутся с сайта parsec.fi. Также можно поставить автообновление <i>(таймер 10 минут)</i> и звуковой сигнал, который будет срабатывать при выходе цены из диапазона.</p>,
		},
		{
			key: "backup",
			label: "Что за значок загрузки?",
			children: <p>Нажатие на него вызывает окно, через которое можно экспортировать/импортировать данные. Также можно нажать <code>Импортировать тестовые данные</code>, чтобы посмотреть тестовые позиции и познакомится с функционалом приложения.</p>,
		},
		// {
		//   key: "revert",
		//   label: "Что за значок R?",
		//   children: <p>Нажатие на него вызывает панель для отлеживания позиций на revert.finance. Отслеживать можно внести несколько адресов. Позиции будут сортироваться относительно размера позиции.</p>,
		// },
		{
			key: "merkl",
			label: "Что за значок М?",
			children: <p>Нажатие на него вызывает панель для проверки появления новых пулов на сервисе Merkl. Алгоритм работы простой: при первом обновлении виджет загружает все пулы с сервиса, а при последующий - будет проверять появление новых вариантов, которые будут помещены в раздел <code>Новые</code>. Так же есть поиск по токенам и протоколам.</p>,
		},
		// {
		//   key: "sushi",
		//   label: "Что за значок S?",
		//   children: <p>Нажатие на него вызывает панель для проверки пулов на бирже Sushi. На сайте бирже есть удобный раздел для поиска пулов, но на нём не отображается средняя APR за месяц и неделю, а эти параметры важны, чтобы искать доходные варианты <i>(загружаются только те пулы, TVL который не меньше $1000)</i>.</p>,
		// },
		{
			key: "llama",
			label: "Что за значок L?",
			children: <p>Нажатие на него вызывает панель для поиска пулов в разделе <code>yields</code> на DeFiLlama. На самом сайте есть удобный поиск, но он громоздкий, а самое главное не позволяет искать токены парами, например ETH-USD. Виджет устраняет этот недостаток. Также в поле поиска можно использовать символ ^ для обозначения начала строки для более точного поиска.</p>,
		},
		{
			key: "calculator",
			label: "Что за значок с калькулятором?",
			children: <p>Нажатие на него вызывает панель с разными калькуляторами.</p>,
		},
		{
			key: "gas",
			label: "Что за значок с числом?",
			children: <p>Это показатель газа в сети эфира. Значение обновляется каждые 5 минут. Также его можно обновить нажатием на сами цифры. Данные берутся с сайта blocknative.com. Нажатии на значок вызывает виджет с основной рыночной информацией <i>(капитализация, индекс страха/жадности, топ валют)</i>. Данные берутся с сайта cryptorank.io.</p>,
		},
		{
			key: "pairs",
			label: "Что за значок с ещё одним графиком?",
			children: <p>Нажатие на него вызывает панель с графиками котировок для произвольных пар токенов. Цены загружаются каждый раз при открытии графика. Данные берутся с сайта livecoinwatch.com.</p>,
		},
	]

	return <Collapse size={"small"} accordion items={items} />
}
