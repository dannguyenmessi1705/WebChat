**Phân Tích và Thiết Kế Hệ Thống Chat Real-Time Sử Dụng ReactJs, Spring Boot và Kiến Trúc Microservices**  
**Lời mở đầu**  
Báo cáo này trình bày một kế hoạch chi tiết và phân tích kỹ thuật chuyên sâu cho việc phát triển một ứng dụng chat trực tuyến (real-time web chat). Mục tiêu là cung cấp một giải pháp kiến trúc toàn diện, sử dụng ReactJs cho giao diện người dùng (frontend) và Spring Boot cho phần xử lý nghiệp vụ phía máy chủ (backend). Đặc biệt, báo cáo tập trung vào việc xây dựng hệ thống dựa trên kiến trúc microservices, giới hạn tối đa ba dịch vụ, đồng thời tích hợp các công nghệ hiện đại như Redis và Kafka để tối ưu hóa hiệu suất và khả năng mở rộng.  
Phạm vi của báo cáo bao gồm việc phân tích các nghiệp vụ cốt lõi của một ứng dụng chat, đề xuất một kiến trúc microservices chặt chẽ, lựa chọn và tích hợp các công nghệ chủ chốt, cũng như thiết kế chi tiết các giao diện lập trình ứng dụng (API) và luồng xử lý dữ liệu tương ứng. Báo cáo này được biên soạn với giả định người đọc có kiến thức nền tảng về phát triển web, các khái niệm microservices và các công nghệ được đề cập. Trọng tâm chính sẽ là kiến trúc backend và các điểm tương tác của nó với frontend.  
**I. Phân tích Nghiệp vụ Ứng dụng Chat (Business Logic Analysis for Chat Application)**  
Để xây dựng một ứng dụng chat hiện đại và đáp ứng nhu cầu người dùng, việc phân tích kỹ lưỡng các nghiệp vụ cốt lõi là bước đầu tiên và quan trọng nhất. Phần này sẽ đi sâu vào các chức năng thiết yếu, dựa trên các tính năng phổ biến của các nền tảng chat hàng đầu và các thông lệ kỹ thuật tốt nhất.

* **1.1. Quản lý Người dùng (User Management)**Nghiệp vụ quản lý người dùng là nền tảng của bất kỳ ứng dụng nào yêu cầu định danh và cá nhân hóa trải nghiệm.  
  * **Đăng ký, Đăng nhập, Xác thực (Registration, Login, Authentication)**: Người dùng cần có khả năng tạo tài khoản mới, đăng nhập một cách an toàn và được hệ thống xác thực danh tính để truy cập các chức năng. Đây là yêu cầu cơ bản cho mọi ứng dụng cá nhân hóa. Các dịch vụ quản lý người dùng hiện đại cung cấp khả năng quản lý tài khoản người dùng từ đầu đến cuối, bao gồm đăng ký, đăng nhập, xác thực, đăng nhập một lần (SSO) nếu có, và quản lý quyền hạn. Một trải nghiệm đăng ký liền mạch là rất quan trọng; lý tưởng nhất là cho phép người dùng xác thực tài khoản qua số điện thoại, địa chỉ email hoặc các tài khoản mạng xã hội. Chi tiết hơn, quá trình đăng ký sẽ thu thập các thông tin cần thiết như tên người dùng, email và mật khẩu, đồng thời áp dụng các chính sách mật khẩu mạnh. Quá trình đăng nhập sẽ xác thực người dùng dựa trên thông tin đã lưu trữ. Việc sử dụng JWT (JSON Web Tokens) được khuyến nghị để quản lý session một cách stateless, phù hợp với kiến trúc microservices. Framework Spring Security có thể được tận dụng để xây dựng các cơ chế xác thực và ủy quyền mạnh mẽ.  
  * **Hồ sơ người dùng (User Profiles)**: Người dùng nên có khả năng quản lý thông tin cá nhân của mình, ví dụ như tên hiển thị, ảnh đại diện (avatar), thông điệp trạng thái, v.v. Hầu hết các ứng dụng hiện đại đều có hồ sơ người dùng, cho phép người dùng quản lý danh tính và tùy chọn của họ. Thông tin này có thể được hiển thị cho người dùng khác trong các cửa sổ chat hoặc danh sách liên hệ.  
  * **Quản lý Danh bạ (Contact Management)**: Người dùng cần có khả năng thêm, xóa và xem danh sách bạn bè hoặc liên hệ. Việc tích hợp với danh bạ trên thiết bị có thể cải thiện đáng kể trải nghiệm người dùng. Việc làm cho việc tích hợp danh bạ trở nên thuận tiện là quan trọng, lý tưởng nhất là tự động nhập từ danh bạ của thiết bị và hiển thị những liên hệ nào đã sử dụng ứng dụng. Chức năng tìm kiếm người dùng khác và gửi yêu cầu kết bạn, cùng với việc hiển thị danh sách liên hệ và trạng thái trực tuyến của họ, là những yếu tố cần thiết.  
  * **Tìm kiếm Người dùng (User Search)**: Cung cấp khả năng cho người dùng tìm kiếm những người dùng khác trong nền tảng, thường là qua tên người dùng hoặc email. Điều này rất quan trọng để kết nối với những người mới. Cần triển khai chức năng tìm kiếm hiệu quả, có thể kèm theo việc đánh chỉ mục (indexing) cho cơ sở dữ liệu người dùng lớn, đồng thời xem xét các cài đặt riêng tư cho khả năng khám phá người dùng.

Một khía cạnh thường bị bỏ qua trong các ứng dụng chat ban đầu nhưng lại có tầm quan trọng chiến lược là Kiểm soát Truy cập Dựa trên Vai trò (Role-Based Access Control \- RBAC). Mặc dù một ứng dụng chat cơ bản có thể chỉ có một loại người dùng duy nhất, việc triển khai một khung RBAC cơ bản ngay từ đầu mang lại sự linh hoạt cho tương lai. Ví dụ, có thể có vai trò quản trị viên (admin) để quản lý các nhóm chat, kiểm duyệt nội dung, hoặc truy cập vào các phân tích hệ thống. Nếu không có RBAC, việc thêm các tính năng như vậy sau này sẽ đòi hỏi một nỗ lực tái cấu trúc đáng kể. Do đó, Dịch vụ Người dùng nên được thiết kế với khả năng RBAC, ngay cả khi các vai trò ban đầu chỉ đơn giản là 'người dùng' và 'quản trị viên', để chuẩn bị cho khả năng mở rộng về tính năng và loại người dùng trong tương lai.

* **1.2. Nhắn tin (Messaging)**Đây là chức năng cốt lõi và trung tâm của ứng dụng chat.  
  * **Chat 1-1 (One-to-one Chat)**: Chức năng cơ bản cho phép hai người dùng trao đổi tin nhắn riêng tư với nhau. Hầu hết các ứng dụng nhắn tin lớn như WhatsApp, Messenger, Telegram đều coi đây là tính năng chính.  
  * **Chat Nhóm (Group Chat)**: Cho phép nhiều người dùng tham gia vào một cuộc trò chuyện chung. Một ứng dụng nhắn tin không hỗ trợ chat nhóm sẽ không hữu ích cho đối tượng người dùng hiện đại; cần xem xét các nhóm công khai/riêng tư hoặc các kênh chuyên dụng. Một số nền tảng hỗ trợ nhóm chat với số lượng thành viên rất lớn, điều này đặt ra các yêu cầu về khả năng mở rộng. Các tính năng cần thiết bao gồm tạo nhóm, thêm/xóa thành viên, đặt tên nhóm và có thể gán quản trị viên nhóm.  
  * **Gửi/Nhận Tin nhắn (Sending/Receiving Messages)**: Hành động cơ bản của việc soạn và truyền tin nhắn, cũng như hiển thị các tin nhắn nhận được. Hỗ trợ tin nhắn văn bản và đảm bảo việc gửi/nhận tin nhắn diễn ra trong thời gian thực là yêu cầu tiên quyết.  
  * **Trạng thái Tin nhắn (Đã gửi, Đã nhận, Đã xem) (Message Status: Sent, Delivered, Read)**: Cung cấp cho người dùng thông tin phản hồi về việc tin nhắn của họ đã được gửi đi, đã đến thiết bị người nhận và đã được đọc hay chưa. Người dùng cần biết trạng thái tin nhắn (đã gửi, đã đọc, đã chỉnh sửa, gửi thất bại).  
  * **Lịch sử Tin nhắn (Message History)**: Người dùng mong muốn có thể truy cập lại các cuộc trò chuyện trước đây. Hệ thống cần lưu trữ và cho phép truy xuất lịch sử tin nhắn một cách hiệu quả, bao gồm cả khả năng tìm kiếm trong lịch sử chat.  
  * **Gửi File và Đa phương tiện (File and Media Sharing)**: Hỗ trợ gửi hình ảnh, video, tài liệu và các loại tệp khác. Các ứng dụng như Facebook Messenger cho phép truyền file, hình ảnh, âm thanh , và WhatsApp hỗ trợ chia sẻ nhiều loại tài liệu. Cần xem xét các giải pháp lưu trữ tệp (ví dụ: lưu trữ đám mây như Amazon S3), giới hạn kích thước tệp và quét bảo mật.  
  * **Biểu tượng cảm xúc và Reactions (Emojis and Reactions)**: Tăng cường khả năng biểu đạt trong cuộc trò chuyện. Các ứng dụng như WhatsApp hỗ trợ biểu tượng cảm xúc , và Google Chat cho phép người dùng thể hiện cá tính qua emoji tùy chỉnh, reactions.

Việc tích hợp các tính năng nhắn tin phong phú như chia sẻ file/media, reactions, và trạng thái tin nhắn, mặc dù là tiêu chuẩn, nhưng lại có tác động đáng kể đến sự phức tạp của hệ thống. Lưu trữ các tệp nhị phân (hình ảnh, video) đòi hỏi một chiến lược khác (ví dụ: lưu trữ đối tượng như S3) so với việc lưu trữ tin nhắn văn bản trong cơ sở dữ liệu. Siêu dữ liệu tin nhắn (trạng thái, reactions) làm tăng độ phức tạp của mô hình dữ liệu cho mỗi tin nhắn. Việc gửi/nhận media tiêu tốn nhiều băng thông hơn và có thể ảnh hưởng đến hiệu suất hiển thị phía client; có thể cần tạo ảnh thumbnail hoặc các phiên bản tối ưu hóa. Reactions và thông báo đã đọc là các sự kiện thời gian thực cần được truyền đến tất cả những người tham gia liên quan, làm tăng lưu lượng WebSocket và xử lý phía backend. Do đó, thiết kế phải tính đến việc xử lý hiệu quả dữ liệu nhị phân, độ phức tạp cơ sở dữ liệu tăng lên cho siêu dữ liệu tin nhắn và lưu lượng thời gian thực cao hơn. Điều này có thể ảnh hưởng đến lựa chọn cơ sở dữ liệu (ví dụ: NoSQL cho schema tin nhắn linh hoạt) và nhu cầu sử dụng CDN cho media.

* **1.3. Giao tiếp Thời gian thực và Thông báo (Real-time Communication and Notifications)**Khả năng giao tiếp tức thời và nhận thông báo kịp thời là yếu tố sống còn của ứng dụng chat.  
  * **Trạng thái Hiện diện (Online/Offline/Typing Indicators) (Presence Status)**: Hiển thị cho người dùng biết bạn bè của họ có đang trực tuyến, ngoại tuyến hay đang soạn tin nhắn hay không. Người dùng muốn biết ai đang trực tuyến, lần cuối họ trực tuyến là khi nào, và khi nào người ở đầu kia đang gõ. Một số hệ thống chat microservices thậm chí có một dịch vụ presence chuyên dụng.  
  * **Thông báo Tin nhắn mới (New Message Notifications)**: Cảnh báo người dùng về các tin nhắn mới đến, cả trong ứng dụng và có thể thông qua thông báo hệ thống. Các hệ thống chat thời gian thực tập trung vào giao tiếp tức thì , và việc xây dựng hệ thống thông báo là một nghiệp vụ quan trọng.  
  * **Thông báo Đẩy (Push Notifications)**: Cho phép ứng dụng thông báo cho người dùng ngay cả khi họ không tích cực sử dụng tab ứng dụng (yêu cầu sự cho phép của người dùng). Đối với web, điều này thường có nghĩa là sử dụng API Push của trình duyệt và Service Workers. Các dịch vụ như Firebase có thể được sử dụng để quản lý việc gửi thông báo đẩy.

Kafka đóng vai trò kép quan trọng trong hệ thống thông báo. Nó không chỉ là một kênh truyền sự kiện mà còn có thể là điểm khử trùng lặp hoặc xử lý theo lô. Kafka có thể hoạt động như một nhật ký trung tâm cho tất cả các sự kiện *có thể* kích hoạt thông báo. Dịch vụ Thông báo (Notification Service) sẽ tiêu thụ các sự kiện này. Điều này giúp tách rời logic thông báo: dịch vụ tạo ra sự kiện (ví dụ: Dịch vụ Nhắn tin cho tin nhắn mới) không cần biết thông báo được gửi đi như thế nào, nó chỉ cần xuất bản một sự kiện lên Kafka. Đối với các sự kiện tần suất cao (ví dụ: chỉ báo đang gõ hoặc nhiều tin nhắn liên tiếp), các consumer của Kafka có thể triển khai logic để xử lý theo lô hoặc gửi thông báo tóm tắt, tránh làm quá tải người dùng hoặc các kênh gửi. Các chủ đề Kafka khác nhau có thể được sử dụng cho các loại sự kiện thô khác nhau. Dịch vụ Thông báo sau đó có thể tiêu thụ chúng, áp dụng tùy chọn của người dùng , và quản lý việc gửi, có thể sử dụng Redis cho trạng thái tạm thời hoặc bộ đếm giới hạn tỷ lệ.

* **1.4. An ninh và Bảo mật (Security)**Bảo vệ dữ liệu người dùng và đảm bảo tính riêng tư là tối quan trọng.  
  * **Mã hóa đầu cuối (End-to-End Encryption \- E2EE)**: Đảm bảo rằng chỉ những người dùng đang giao tiếp mới có thể đọc được tin nhắn. Mặc dù rất được mong đợi về mặt quyền riêng tư, E2EE làm tăng đáng kể độ phức tạp của hệ thống. Các ứng dụng như WhatsApp triển khai mã hóa đầu cuối, nơi người nhận được cung cấp khóa để giải mã tin nhắn, đảm bảo không bên thứ ba nào (kể cả nhà cung cấp dịch vụ) có thể truy cập nội dung.  
  * **Xác thực an toàn (Secure Authentication)**: Bảo vệ tài khoản và dữ liệu người dùng thông qua các cơ chế xác thực mạnh mẽ. Việc triển khai các phương thức xác thực mạnh như xác thực đa yếu tố (MFA) và quản lý cẩn thận quyền truy cập của người dùng vào tài nguyên và dữ liệu là rất quan trọng.

Có một sự đánh đổi quan trọng giữa việc triển khai Mã hóa Đầu cuối (E2EE) và khả năng thực hiện các chức năng phía máy chủ trong một kiến trúc microservices sử dụng Kafka. Nếu tin nhắn được mã hóa đầu cuối, nội dung của chúng sẽ không thể đọc được bởi máy chủ. Điều này ảnh hưởng trực tiếp đến các tính năng phía máy chủ như lập chỉ mục tin nhắn để tìm kiếm, kiểm duyệt nội dung (nếu cần), hoặc thậm chí chuyển đổi tin nhắn nếu các client khác nhau hỗ trợ các bộ tính năng khác nhau. Kafka, trong trường hợp này, sẽ chỉ vận chuyển các khối dữ liệu đã được mã hóa. E2EE thực sự có nghĩa là Dịch vụ Nhắn tin và Kafka chủ yếu xử lý các payload đã mã hóa. Các tính năng yêu cầu nội dung tin nhắn (như tìm kiếm phía máy chủ) trở nên bất khả thi hoặc cần triển khai phía client. Mặc dù nội dung tin nhắn được mã hóa, siêu dữ liệu (người gửi, người nhận, dấu thời gian, ID nhóm) có thể vẫn không được mã hóa để phục vụ cho việc định tuyến và tổ chức lưu trữ, và bản thân siêu dữ liệu này cũng có thể nhạy cảm. Hơn nữa, E2EE đòi hỏi một hệ thống quản lý khóa mạnh mẽ, phức tạp để thiết kế và triển khai một cách an toàn, đặc biệt là đối với các cuộc trò chuyện nhóm. Do đó, cần phải thừa nhận những lợi ích về quyền riêng tư mạnh mẽ của E2EE, nhưng cũng phải nêu rõ những đánh đổi: nó hạn chế đáng kể các chức năng phía máy chủ dựa trên nội dung tin nhắn và làm tăng đáng kể độ phức tạp của việc quản lý khóa. Đối với kiến trúc được đề xuất, việc triển khai E2EE đầy đủ có nghĩa là Dịch vụ Nhắn tin sẽ lưu trữ các khối dữ liệu đã mã hóa và Kafka sẽ vận chuyển chúng. Nếu các tính năng phía máy chủ trên nội dung tin nhắn là quan trọng, E2EE có thể không khả thi, và trọng tâm nên chuyển sang mã hóa truyền tải mạnh (TLS/SSL) và mã hóa dữ liệu khi lưu trữ (data-at-rest encryption) cho các cơ sở dữ liệu. Đây là một quyết định thiết kế quan trọng cần được nhấn mạnh.  
**II. Thiết kế Microservices (Microservice Design)**  
Phần này trình bày chi tiết kiến trúc microservices, tuân thủ yêu cầu của người dùng về việc giới hạn tối đa ba dịch vụ. Thiết kế này ưu tiên sự gắn kết logic, khả năng mở rộng và việc sử dụng hiệu quả các công nghệ đã chỉ định.

* **2.1. Nguyên tắc Thiết kế (Design Principles)**Các nguyên tắc sau đây sẽ định hướng cho việc thiết kế kiến trúc microservices:  
  * **Database per Service (Cơ sở dữ liệu riêng cho mỗi dịch vụ)**: Mỗi microservice sẽ quản lý cơ sở dữ liệu chuyên dụng của riêng mình để đảm bảo tính découple (loose coupling) và khả năng mở rộng độc lập. Việc giữ dữ liệu ổn định của mỗi microservice ở chế độ riêng tư và chỉ có thể truy cập thông qua API của nó là một giải pháp quan trọng. Điều này đảm bảo rằng các thay đổi đối với cơ sở dữ liệu của một dịch vụ không ảnh hưởng đến bất kỳ dịch vụ nào khác và cho phép mỗi dịch vụ chọn loại cơ sở dữ liệu phù hợp nhất với nhu cầu của mình (ví dụ: SQL cho Dịch vụ Người dùng, NoSQL cho Dịch vụ Nhắn tin). Mô hình này tránh được các cơ sở dữ liệu nguyên khối (monolithic databases) có thể trở thành điểm nghẽn. Tuy nhiên, nó cũng đặt ra những thách thức trong việc triển khai các giao dịch (transactions) và truy vấn (queries) trải dài trên nhiều dịch vụ. Những thách thức này thường được giải quyết bằng cách sử dụng API composition hoặc các mẫu thiết kế hướng sự kiện (event-driven patterns) như CQRS.  
  * **Giao tiếp giữa các services (Inter-service Communication)**: Một sự kết hợp giữa giao tiếp đồng bộ (synchronous), ví dụ như REST cho các yêu cầu trực tiếp, và giao tiếp bất đồng bộ (asynchronous), ví dụ như Kafka cho các sự kiện, sẽ được sử dụng. Các ứng dụng microservices thường sử dụng kết hợp cả hai kiểu giao tiếp này. Giao tiếp bất đồng bộ mang lại các lợi ích như giảm sự phụ thuộc lẫn nhau giữa các dịch vụ, khả năng có nhiều người đăng ký nhận sự kiện (multiple subscribers), cách ly lỗi (failure isolation) và cân bằng tải (load leveling). Việc sử dụng hàng đợi tin nhắn (message queues) như Kafka cho giao tiếp bất đồng bộ được khuyến khích vì những lợi ích về xử lý lỗi, bảo mật và hiệu quả. Cụ thể:  
    * **Đồng bộ**: Được sử dụng cho các hoạt động yêu cầu phản hồi ngay lập tức (ví dụ: xác thực người dùng).  
    * **Bất đồng bộ**: Được sử dụng để tách rời các dịch vụ, xử lý các tác vụ nền và phát sóng các sự kiện (ví dụ: thông báo tin nhắn mới, cập nhật trạng thái hiện diện). Kafka sẽ là phương tiện chính cho loại giao tiếp này.  
* **2.2. Phân chia Microservices (Tối đa 3 Dịch vụ)**Việc chia thành ba dịch vụ nhằm mục đích nhóm các chức năng liên quan một cách logic, đảm bảo mỗi dịch vụ có một trách nhiệm rõ ràng và có thể phát triển, triển khai, mở rộng độc lập.  
  * **2.2.1. Dịch vụ Người dùng (User Service)**  
    * **Trách nhiệm (Responsibilities)**:  
      * Quản lý tất cả các khía cạnh của danh tính và vòng đời người dùng.  
      * Xử lý đăng ký, đăng nhập, xác thực và ủy quyền người dùng (bao gồm tạo/xác minh token).  
      * Quản lý hồ sơ người dùng (các thao tác CRUD).  
      * Quản lý danh sách liên hệ/mối quan hệ bạn bè.  
      * Cung cấp chức năng tìm kiếm người dùng. Các hệ thống quản lý người dùng hiện đại đảm nhận các chức năng IAM cốt lõi như đăng ký người dùng, đăng nhập, xác thực, quản lý quyền và lưu trữ thông tin chi tiết của người dùng. Một số kiến trúc microservices cho ứng dụng chat có dịch vụ accounts chuyên biệt cho tài khoản và xác thực người dùng, và dịch vụ authorization cho vai trò/quyền hạn ; trong mô hình ba dịch vụ của chúng ta, các chức năng này được hợp nhất. Các máy chủ API trong một số thiết kế cũng xử lý việc đăng nhập, đăng ký và thay đổi hồ sơ người dùng.  
    * **Công nghệ chính (Key Technologies)**:  
      * Spring Boot  
      * Cơ sở dữ liệu: Quan hệ (ví dụ: PostgreSQL, MySQL) cho dữ liệu người dùng có cấu trúc, thông tin xác thực và các mối quan hệ. Lựa chọn này dựa trên nguyên tắc mỗi dịch vụ chọn cơ sở dữ liệu phù hợp với nhu cầu của mình.  
      * Spring Security để xác thực/ủy quyền.  
  * **2.2.2. Dịch vụ Nhắn tin (Messaging Service)**  
    * **Trách nhiệm (Responsibilities)**:  
      * Lưu trữ và truy xuất tin nhắn chat (1-1 và nhóm).  
      * Quản lý các phòng chat/cuộc trò chuyện (siêu dữ liệu như người tham gia, ngày tạo).  
      * Xử lý lịch sử tin nhắn và tìm kiếm trong lịch sử (nếu chọn tìm kiếm phía máy chủ thay vì E2EE).  
      * Lưu trữ và quản lý các tệp/media được chia sẻ (hoặc con trỏ đến chúng nếu sử dụng bộ nhớ ngoài như S3). Một số thiết kế hệ thống chat ngụ ý một dịch vụ chat lưu trữ tin nhắn, ví dụ như trong một kho lưu trữ khóa-giá trị cho lịch sử chat. Dịch vụ này sẽ tiêu thụ tin nhắn từ Kafka (do Dịch vụ Thời gian thực tạo ra khi nhận từ client) để lưu trữ.  
    * **Công nghệ chính (Key Technologies)**:  
      * Spring Boot  
      * Cơ sở dữ liệu:  
        * NoSQL (ví dụ: Cassandra, MongoDB) rất được khuyến nghị vì khả năng mở rộng, schema linh hoạt (cho các loại tin nhắn khác nhau, reactions, siêu dữ liệu) và thông lượng ghi tin nhắn cao.  
        * Ngoài ra, PostgreSQL với kiểu dữ liệu JSONB và việc đánh chỉ mục phù hợp cũng có thể xử lý dữ liệu tin nhắn nhưng có thể gặp thách thức về mở rộng sớm hơn so với các giải pháp NoSQL chuyên dụng cho khối lượng rất lớn.  
      * Apache Kafka: Tiêu thụ các sự kiện tin nhắn mới để lưu trữ. Có thể xuất bản các sự kiện "tin nhắn đã lưu trữ" nếu các dịch vụ khác cần phản ứng với việc lưu trữ thành công.  
  * **2.2.3. Dịch vụ Thời gian thực & Thông báo (Real-time & Notification Service)**  
    * **Trách nhiệm (Responsibilities)**:  
      * Quản lý các kết nối WebSocket từ client.  
      * Xử lý tin nhắn đến từ client qua WebSockets và xuất bản chúng lên một chủ đề Kafka để Dịch vụ Nhắn tin tiêu thụ và lưu trữ.  
      * Nhận tin nhắn/sự kiện từ Kafka (ví dụ: tin nhắn mới được Dịch vụ Nhắn tin lưu trữ, cập nhật trạng thái hiện diện) và gửi chúng đến các client thích hợp qua WebSockets.  
      * Quản lý trạng thái hiện diện của người dùng (trực tuyến, ngoại tuyến, đang gõ) bằng Redis.  
      * Tạo và gửi thông báo (trong ứng dụng, thông báo đẩy của trình duyệt) dựa trên các sự kiện từ Kafka hoặc các trình kích hoạt trực tiếp. Một số kiến trúc microservices cho ứng dụng chat có ddp-streamer cho kết nối WebSocket, dịch vụ presence, và stream-hub làm nhà môi giới tin nhắn (mà chúng ta phần lớn thay thế bằng Kafka/Redis pub-sub cho các tác vụ cụ thể). Dịch vụ này sẽ bao gồm nhiều thành phần được mô tả trong các thiết kế hệ thống thông báo, chẳng hạn như các trình xử lý cho các loại thông báo khác nhau và tương tác với Kafka.  
    * **Công nghệ chính (Key Technologies)**:  
      * Spring Boot  
      * WebSockets (Spring WebSockets với STOMP để nhắn tin có cấu trúc).  
      * Redis:  
        * Quản lý thông tin phiên WebSocket (ánh xạ người dùng với kết nối).  
        * Lưu trữ và phát sóng trạng thái hiện diện của người dùng.  
        * Có khả năng giới hạn tỷ lệ thông báo.  
        * Redis Pub/Sub có thể được sử dụng cho các sự kiện thời gian thực cục bộ, nhanh chóng trong dịch vụ này hoặc giữa các phiên bản của nó, bổ sung cho Kafka cho các sự kiện liên dịch vụ rộng hơn.  
      * Apache Kafka:  
        * Xuất bản tin nhắn thô nhận được từ client để Dịch vụ Nhắn tin tiêu thụ.  
        * Tiêu thụ tin nhắn đã xử lý/lưu trữ hoặc các sự kiện khác (ví dụ: thay đổi trạng thái hiện diện, người dùng mới đăng ký) để phát sóng cho client.  
        * Phân phối các sự kiện kích hoạt thông báo.

Dịch vụ Thời gian thực & Thông báo (RNS) đóng vai trò cực kỳ quan trọng, hoạt động như một trung tâm giao tiếp chính. Với chỉ ba dịch vụ, RNS trở nên rất trung tâm, điều này đặt ra những câu hỏi về khả năng mở rộng và khả năng chịu lỗi. Vì tất cả lưu lượng thời gian thực đều đi qua nó, RNS phải có khả năng mở rộng cao; việc mở rộng theo chiều ngang (nhiều phiên bản) là rất cần thiết. Khi mở rộng, việc quản lý kết nối WebSocket trên các phiên bản trở thành một thách thức. Redis rất quan trọng ở đây để lưu trữ trạng thái phiên (người dùng nào được kết nối với phiên bản/ID phiên WebSocket nào) để bất kỳ phiên bản nào của RNS cũng có thể tra cứu nơi gửi tin nhắn. Kafka tách rời RNS khỏi Dịch vụ Nhắn tin, có thể hấp thụ các đợt tin nhắn đến và phân phối chúng để lưu trữ. Nó cũng cung cấp các tin nhắn đã lưu trữ trở lại RNS để phát sóng, đảm bảo rằng ngay cả khi một phiên bản của RNS gặp sự cố, tin nhắn không bị mất trước khi lưu trữ và có thể được gửi đi sau khi kết nối được thiết lập lại. Tuy nhiên, RNS phải xử lý nhiều công nghệ (WebSockets, Redis, Kafka) và trách nhiệm, khiến nó trở thành dịch vụ phức tạp nhất trong ba dịch vụ. Do đó, RNS là yếu tố quan trọng nhất đối với hiệu suất và độ tin cậy mà người dùng cảm nhận được. Cần chi tiết hóa các chiến lược mở rộng của nó, bao gồm mở rộng theo chiều ngang, sử dụng Redis để quản lý phiên phân tán và tận dụng Kafka để cân bằng tải và luồng tin nhắn linh hoạt.**Bảng 2.1: Tổng quan Microservices**

| Tên Microservice | Mô tả Trách nhiệm Chính | Công nghệ Chính (Framework, Giao tiếp, Mục đích Đặc biệt) | Loại Database (Ví dụ) | Giao tiếp Chính (Vào/Ra, Đồng bộ/Bất đồng bộ) |
| :---- | :---- | :---- | :---- | :---- |
| Dịch vụ Người dùng (User Service) | Quản lý danh tính người dùng, hồ sơ, danh bạ, xác thực & ủy quyền. | Spring Boot, REST APIs, Spring Security | Quan hệ (PostgreSQL) | Đồng bộ (REST cho yêu cầu từ client) |
| Dịch vụ Nhắn tin (Messaging Service) | Lưu trữ và truy xuất tin nhắn (1-1, nhóm), quản lý phòng chat, lịch sử, media. Tiêu thụ tin nhắn từ Kafka để lưu trữ. | Spring Boot, Apache Kafka (consumer) | NoSQL (Cassandra, MongoDB) | Bất đồng bộ (Tiêu thụ từ Kafka). Có thể có REST API nội bộ cho quản trị. |
| Dịch vụ Thời gian thực & Thông báo (Real-time & Notification Service) | Quản lý kết nối WebSocket, xử lý tin nhắn đến/đi qua WebSocket, xuất bản/tiêu thụ sự kiện Kafka, quản lý hiện diện (Redis), gửi thông báo. | Spring Boot, WebSockets (STOMP), Apache Kafka, Redis | Chủ yếu là Redis, có thể không cần DB riêng | WebSocket (Client \<-\> Server). Bất đồng bộ (Xuất bản/Tiêu thụ từ Kafka). Tương tác Redis cho trạng thái. |

* **2.3. Lựa chọn Công nghệ Chi tiết (Detailed Technology Choices)**Việc lựa chọn công nghệ phù hợp là yếu tố then chốt để đảm bảo hiệu suất, khả năng bảo trì và mở rộng của hệ thống.  
  * **Frontend**: ReactJs (Theo yêu cầu người dùng).  
  * **Backend Framework**: Spring Boot (Java). Spring Boot với nhiều tính năng được xây dựng sẵn giúp dễ dàng xây dựng và chạy các microservices ở quy mô sản xuất, và đã trở thành tiêu chuẩn thực tế cho các microservices Java. Mô hình máy chủ nhúng của nó cho phép khởi động nhanh chóng.  
  * **Giao tiếp Real-time (Real-time Communication)**: WebSockets (cụ thể là Spring WebSockets với STOMP). Spring Boot hỗ trợ cấu hình WebSocket thông qua @EnableWebSocketMessageBroker, registerStompEndpoints và configureMessageBroker. STOMP cung cấp một giao thức nhắn tin hướng văn bản đơn giản qua WebSockets, giúp cấu trúc hóa giao tiếp client-server. WebSockets cho phép giao tiếp hai chiều, thời gian thực, điều này rất cần thiết cho các ứng dụng chat.  
  * **Message Broker**: Apache Kafka.  
    * **Các trường hợp sử dụng**:  
      * **Giao tiếp bất đồng bộ giữa các dịch vụ**: Tách rời Dịch vụ Thời gian thực & Thông báo khỏi Dịch vụ Nhắn tin để lưu trữ tin nhắn.  
      * **Đường ống gửi tin nhắn (Message Delivery Pipeline)**: Đảm bảo gửi tin nhắn đáng tin cậy ngay cả khi một dịch vụ tạm thời ngừng hoạt động.  
      * **Nguồn sự kiện cho thông báo/cập nhật (Event Sourcing)**: Phát sóng các sự kiện như tin nhắn mới, thay đổi trạng thái hiện diện, đăng ký người dùng mới đến các dịch vụ quan tâm.  
      * **Khả năng mở rộng và chịu lỗi**: Kiến trúc phân tán của Kafka hỗ trợ thông lượng cao và khả năng phục hồi. Apache Kafka đóng vai trò quan trọng trong kiến trúc microservices, cho phép các dịch vụ xuất bản và đăng ký nhận tin nhắn, lưu trữ bản ghi một cách bền vững và xử lý các luồng dữ liệu thời gian thực.  
  * **In-memory Data Store/Cache**: Redis.  
    * **Các trường hợp sử dụng**:  
      * **Caching User Sessions**: Lưu trữ dữ liệu phiên để Dịch vụ Thời gian thực & Thông báo xác minh nhanh chóng.  
      * **Quản lý Trạng thái Hiện diện**: Lưu trữ và cập nhật trạng thái trực tuyến/ngoại tuyến/đang gõ của người dùng để truy xuất và phát sóng nhanh chóng.  
      * **Ánh xạ Kết nối WebSocket**: Trong một Dịch vụ Thời gian thực & Thông báo được mở rộng, ánh xạ ID người dùng hoặc ID phiên với các phiên bản/kết nối máy chủ WebSocket cụ thể.  
      * **Giới hạn Tỷ lệ (Rate Limiting)**: Triển khai giới hạn tỷ lệ cho các lệnh gọi API hoặc gửi thông báo.  
      * **Redis Pub/Sub**: Có thể được sử dụng cho các sự kiện thời gian thực cục bộ, độ trễ rất thấp trong cụm Dịch vụ Thời gian thực & Thông báo, ví dụ như chỉ báo đang gõ hoặc thông báo tạm thời không cần đảm bảo độ bền của Kafka. Redis là một kho lưu trữ khóa-giá trị trong bộ nhớ, xuất sắc trong việc lưu trữ và truy xuất dữ liệu nhanh chóng, phù hợp cho việc quản lý phiên, phân tích thời gian thực, và như một hệ thống pub/sub cho thông báo. Spring Data Redis cung cấp phương tiện để xuất bản và đăng ký nhận tin nhắn.  
  * **Cơ sở dữ liệu (Databases)**: Lựa chọn theo nhu cầu của từng dịch vụ.  
    * **Dịch vụ Người dùng**: Quan hệ (ví dụ: PostgreSQL).  
      * **Lý do**: Dữ liệu người dùng, thông tin xác thực và mối quan hệ liên hệ có cấu trúc tốt và được hưởng lợi từ các thuộc tính ACID và tính toàn vẹn quan hệ. PostgreSQL là một RDBMS mã nguồn mở mạnh mẽ, giàu tính năng.  
    * **Dịch vụ Nhắn tin**: NoSQL (ví dụ: Apache Cassandra hoặc MongoDB).  
      * **Lý do**: Tin nhắn chat có thể có khối lượng lớn, yêu cầu thông lượng ghi cao và được hưởng lợi từ schema linh hoạt (ví dụ: để chứa các loại tin nhắn khác nhau, reactions, các bổ sung trong tương lai). Cassandra nổi trội về khả năng mở rộng ghi và kiến trúc phân tán. MongoDB cung cấp sự linh hoạt và dễ sử dụng.  
    * **Dịch vụ Thời gian thực & Thông báo**:  
      * **Lý do**: Dịch vụ này chủ yếu quản lý trạng thái tạm thời trong Redis (hiện diện, phiên WebSocket) và xử lý các sự kiện từ Kafka. Nó có thể không yêu cầu cơ sở dữ liệu quan hệ hoặc NoSQL ổn định của riêng mình nếu tất cả dữ liệu ổn định cần thiết thuộc sở hữu của Dịch vụ Người dùng hoặc Dịch vụ Nhắn tin. Nếu cần lưu trữ các mẫu thông báo hoặc tùy chọn thông báo cụ thể của người dùng một cách ổn định, có thể xem xét một DB quan hệ nhỏ hoặc kho lưu trữ tài liệu, nhưng mục tiêu là giữ cho nó nhẹ nhàng. Redis có thể được sử dụng để lưu trữ thông báo, ngụ ý một số khả năng lưu trữ ổn định có thể được xử lý bởi Redis tùy thuộc vào yêu cầu về độ bền.

Trong Dịch vụ Thời gian thực & Thông báo, cả Kafka và Redis Pub/Sub đều có thể được sử dụng để phổ biến sự kiện, đặt ra câu hỏi về việc khi nào nên sử dụng công nghệ nào. Kafka lý tưởng cho các sự kiện cần được gửi một cách đáng tin cậy giữa các microservices khác nhau (ví dụ: tin nhắn thô từ RNS đến Dịch vụ Nhắn tin để lưu trữ; sự kiện tin nhắn đã lưu trữ từ Dịch vụ Nhắn tin trở lại RNS để phát sóng). Độ bền của Kafka đảm bảo tin nhắn không bị mất nếu một consumer ngừng hoạt động và phù hợp hơn cho các sự kiện có thể có nhiều nhóm consumer đa dạng trên các dịch vụ khác nhau. Ngược lại, Redis Pub/Sub cực kỳ nhanh nhưng thường cung cấp cơ chế gửi "at-most-once" và không bền vững như các chủ đề Kafka. Nó rất phù hợp cho việc phát sóng thông tin tạm thời như chỉ báo đang gõ cho người dùng trong *cùng một phòng chat* mà kết nối của họ được quản lý bởi *cùng một cụm* các phiên bản RNS, hoặc cho các tín hiệu trong chính cụm RNS. Việc sử dụng Redis Pub/Sub cho mọi thứ mà Kafka có thể làm có thể làm phức tạp vai trò của Redis và mất đi lợi ích của Kafka. Ngược lại, việc đẩy các sự kiện tần suất cực cao, giá trị thấp qua Kafka có thể gây thêm chi phí không cần thiết. Do đó, Kafka nên là xương sống cho việc truyền sự kiện liên dịch vụ, ổn định và đáng tin cậy. Redis Pub/Sub có thể là một lựa chọn chiến thuật trong RNS cho các cập nhật thời gian thực cụ thể, độ trễ cực thấp, ít quan trọng hơn hoặc có tính tạm thời cao, đặc biệt là những cập nhật không cần được các microservices khác tiêu thụ hoặc không yêu cầu độ bền của Kafka.  
**III. Triển khai API và Luồng Xử lý (API Design and Processing Flow)**  
Phần này mô tả chi tiết các điểm cuối API cho mỗi microservice và minh họa luồng dữ liệu cũng như luồng kiểm soát cho các chức năng ứng dụng chính.

* **3.1. API Gateway (Khái niệm)**  
  * **Vai trò của API Gateway**: Mặc dù không phải là một trong ba microservices cốt lõi, API Gateway (ví dụ: Spring Cloud Gateway, Kong, Apigee) là một mẫu thiết kế tiêu chuẩn trong kiến trúc microservices. Nó hoạt động như một điểm vào duy nhất cho tất cả các yêu cầu từ client.  
  * **Trách nhiệm**:  
    * Định tuyến các yêu cầu đến các microservices backend thích hợp.  
    * Xác thực và ủy quyền (có thể giảm tải cho các dịch vụ riêng lẻ).  
    * Giới hạn tỷ lệ, kết thúc SSL, chuyển đổi yêu cầu/phản hồi.  
    * Tổng hợp kết quả từ nhiều dịch vụ. Spring Cloud có thể hoạt động như một cổng API. API Gateways cũng được đề cập trong bối cảnh khám phá dịch vụ dựa trên HTTP.  
  * **Lưu ý**: Trong báo cáo này, các yêu cầu từ client (đặc biệt là các yêu cầu HTTP ban đầu như đăng nhập, lấy hồ sơ) sẽ được giả định đi qua một API Gateway khái niệm, sau đó định tuyến đến Dịch vụ Người dùng hoặc khởi tạo kết nối WebSocket với Dịch vụ Thời gian thực & Thông báo. Thiết kế chi tiết của API Gateway nằm ngoài phạm vi của ba dịch vụ cốt lõi nhưng sự hiện diện của nó là một cân nhắc kiến trúc quan trọng.  
* **3.2. Thiết kế API cho từng Microservice**Điều này bao gồm việc xác định các API RESTful cho các tương tác yêu cầu-phản hồi và các loại/chủ đề tin nhắn WebSocket cho giao tiếp thời gian thực.  
  * **3.2.1. User Service APIs (RESTful)**  
    * POST /api/users/register (Đăng ký)  
    * POST /api/users/login (Đăng nhập)  
    * GET /api/users/me (Lấy thông tin người dùng hiện tại)  
    * PUT /api/users/me (Cập nhật hồ sơ người dùng hiện tại)  
    * GET /api/users/search?query={username\_or\_email} (Tìm kiếm người dùng)  
    * GET /api/users/contacts (Lấy danh sách bạn bè)  
    * POST /api/users/contacts (Gửi yêu cầu kết bạn/Thêm bạn)  
    * DELETE /api/users/contacts/{userId} (Xóa bạn)  
  * **3.2.2. Messaging Service APIs (Chủ yếu nội bộ, tiêu thụ qua Kafka; có thể có một số REST cho quản trị/tiện ích)**  
    * Dịch vụ này chủ yếu tiêu thụ tin nhắn từ các chủ đề Kafka (ví dụ: new\_chat\_messages) do Dịch vụ Thời gian thực & Thông báo tạo ra.  
    * Nó có thể exposé các API nội bộ nếu cần cho việc quản lý dữ liệu trực tiếp hoặc các tác vụ quản trị, nhưng tương tác của client cho các luồng nhắn tin sẽ thông qua Dịch vụ Thời gian thực.  
    * Các API REST tiềm năng (cho quản trị hoặc lấy lịch sử trực tiếp nếu không chỉ qua WebSocket):  
      * GET /api/messages/conversation/{conversationId}?page={}\&size={} (Lấy lịch sử tin nhắn cho một cuộc trò chuyện)  
      * GET /api/media/{mediaId} (Lấy tệp media – mặc dù thường được phục vụ qua CDN hoặc dịch vụ lưu trữ chuyên dụng)  
  * **3.2.3. Real-time & Notification Service APIs (WebSockets & REST)**  
    * **WebSocket Endpoints (STOMP destinations)**:  
      * Điểm cuối kết nối: /ws (ví dụ: ws://host:port/ws)  
      * Đích tin nhắn Client-to-Server (client gửi đến đây):  
        * /app/chat.sendMessage (Gửi tin nhắn mới)  
        * /app/chat.typing (Thông báo đang gõ)  
        * /app/presence.update (Cập nhật trạng thái hiện diện – kết nối/ngắt kết nối được xử lý ngầm bởi vòng đời WebSocket)  
      * Đích tin nhắn Server-to-Client (client đăng ký nhận từ đây):  
        * /topic/messages/{userId} (Tin nhắn 1-1 mới cho người dùng)  
        * /topic/messages/group/{groupId} (Tin nhắn nhóm mới)  
        * /topic/presence/{userId} (Cập nhật trạng thái hiện diện của bạn bè)  
        * /topic/notifications/{userId} (Thông báo chung cho người dùng)  
        * /topic/errors/{userId} (Lỗi dành riêng cho người dùng)  
    * **REST APIs (ví dụ: để khởi tạo thông báo đẩy nếu không phải là hướng sự kiện qua Kafka)**:  
      * POST /api/notifications/send (Gửi thông báo đẩy – nhiều khả năng được kích hoạt nội bộ qua các sự kiện Kafka)

**Bảng 3.1: Chi tiết API**

| Microservice | API Endpoint / WebSocket Topic | HTTP Method / WebSocket Action (Send/Subscribe) | Request Payload (JSON/message format) | Response Payload / Broadcast Message (JSON/message format) | Mô tả Ngắn gọn | Công nghệ Liên quan (Kafka topic, Redis key, DB) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| User Service | /api/users/login | POST | { "username": "user1", "password": "pwd" } | { "token": "jwt.token.here", "userId": "uuid" } | Xác thực người dùng, trả về JWT. | Spring Security, PostgreSQL |
| User Service | /api/users/register | POST | { "username": "user1", "email": "user1@example.com", "password": "pwd" } | { "userId": "uuid", "message": "Registration successful" } | Đăng ký người dùng mới. | PostgreSQL |
| User Service | /api/users/me | GET | N/A (Token in Header) | { "userId": "uuid", "username": "user1", "email": "...", "avatarUrl": "..." } | Lấy thông tin người dùng hiện tại. | PostgreSQL |
| Real-time & Notification | /app/chat.sendMessage | SEND (Client to Server) | { "recipientId": "uuid", "content": "Hello\!" } hoặc { "groupId": "uuid", "content": "Hi all\!" } | N/A (Server processes) | Client gửi tin nhắn chat mới. | WebSocket, Kafka (produces to new\_raw\_messages) |
| Real-time & Notification | /topic/messages/{userId} | SUBSCRIBE (Client listens) | N/A | { "messageId": "...", "senderId": "uuid", "content": "Hello\!", "timestamp": "..." } | Client nhận tin nhắn 1-1 mới. | WebSocket, Kafka (consumes from persisted\_messages), Redis (session lookup) |
| Real-time & Notification | /topic/messages/group/{groupId} | SUBSCRIBE (Client listens) | N/A | { "messageId": "...", "groupId": "...", "senderId": "uuid", "content": "Hi\!", "timestamp": "..." } | Client nhận tin nhắn nhóm mới. | WebSocket, Kafka (consumes from persisted\_messages), Redis (session lookup) |
| Real-time & Notification | /app/chat.typing | SEND (Client to Server) | { "recipientId\_or\_groupId": "uuid", "isTyping": true/false } | N/A (Server processes) | Client thông báo trạng thái đang gõ. | WebSocket, Redis Pub/Sub or Kafka (produces to typing\_events) |
| Real-time & Notification | /topic/presence/{userId} | SUBSCRIBE (Client listens) | N/A | { "userId": "friend\_uuid", "status": "online/offline" } | Client nhận cập nhật trạng thái hiện diện của bạn bè. | WebSocket, Kafka (consumes from presence\_updates), Redis (session lookup) |

* **3.3. Luồng Xử lý cho các Nghiệp vụ Chính (Tài liệu Nghiệp vụ)**Phần này mô tả chi tiết các luồng xử lý cho các nghiệp vụ chính dưới dạng tài liệu nghiệp vụ, bao gồm các tác nhân, mục tiêu, điều kiện tiên quyết, kết quả mong đợi và các bước thực hiện.  
  * **3.3.1. Nghiệp vụ: Đăng nhập Người dùng**  
    * **Mã Nghiệp vụ:** UC-LOGIN  
    * **Tác nhân:** Người dùng (thông qua Client ReactJs), API Gateway (khái niệm), User Service.  
    * **Mục tiêu:** Cho phép người dùng đã đăng ký truy cập vào các chức năng của ứng dụng bằng thông tin xác thực của họ.  
    * **Điều kiện tiên quyết:**  
      1. Người dùng đã có một tài khoản hợp lệ trong hệ thống.  
      2. Người dùng biết tên đăng nhập (username/email) và mật khẩu của mình.  
      3. Các thành phần hệ thống liên quan (Client, API Gateway, User Service, Cơ sở dữ liệu người dùng) đang hoạt động bình thường.  
    * **Kết quả thành công (Postconditions \- Success):**  
      1. User Service xác thực thành công thông tin đăng nhập của người dùng.  
      2. Client nhận được một JSON Web Token (JWT) và thông tin cơ bản của người dùng (ví dụ: userId).  
      3. Client lưu trữ JWT token một cách an toàn để sử dụng cho các yêu cầu tiếp theo.  
      4. Giao diện người dùng được cập nhật để phản ánh trạng thái đã đăng nhập (ví dụ: hiển thị tên người dùng, cho phép truy cập các tính năng yêu cầu đăng nhập).  
    * **Kết quả thất bại (Postconditions \- Failure):**  
      1. Người dùng không được xác thực.  
      2. Client hiển thị thông báo lỗi phù hợp cho người dùng (ví dụ: "Tên đăng nhập hoặc mật khẩu không chính xác.", "Tài khoản không tồn tại.").  
    * **Luồng sự kiện chính (Main Flow):**  
      1. Người dùng mở ứng dụng và chọn chức năng "Đăng nhập".  
      2. Client (ReactJs) hiển thị giao diện đăng nhập, yêu cầu người dùng nhập tên đăng nhập và mật khẩu.  
      3. Người dùng nhập tên đăng nhập và mật khẩu, sau đó nhấn nút "Đăng nhập".  
      4. Client gửi yêu cầu POST đến API Gateway tại endpoint /api/users/login, đính kèm tên đăng nhập và mật khẩu trong phần thân yêu cầu (request body).  
      5. API Gateway nhận yêu cầu và chuyển tiếp đến User Service.  
      6. User Service xử lý yêu cầu: a. Truy xuất thông tin người dùng từ cơ sở dữ liệu (PostgreSQL) dựa trên tên đăng nhập được cung cấp. b. So sánh mật khẩu đã mã hóa được lưu trữ với mật khẩu người dùng cung cấp (sau khi đã mã hóa tương ứng). c. Nếu thông tin xác thực hợp lệ: i. Tạo một JWT token chứa thông tin định danh người dùng và thời gian hết hạn. ii. Chuẩn bị phản hồi thành công chứa JWT token và thông tin cơ bản của người dùng. d. Nếu thông tin xác thực không hợp lệ: Chuẩn bị phản hồi lỗi với mã trạng thái và thông báo lỗi phù hợp.  
      7. User Service gửi phản hồi (thành công hoặc thất bại) trở lại API Gateway.  
      8. API Gateway chuyển tiếp phản hồi đến Client.  
      9. Client nhận phản hồi: a. Nếu phản hồi cho biết đăng nhập thành công (ví dụ: mã trạng thái HTTP 200 và có JWT token): i. Lưu trữ JWT token (ví dụ: trong localStorage hoặc sessionStorage). ii. Cập nhật trạng thái ứng dụng và giao diện người dùng để phản ánh người dùng đã đăng nhập. iii. Chuyển hướng người dùng đến trang chính hoặc trang tổng quan của ứng dụng. b. Nếu phản hồi cho biết đăng nhập thất bại (ví dụ: mã trạng thái HTTP 401 Unauthorized hoặc 400 Bad Request): i. Hiển thị thông báo lỗi cho người dùng dựa trên nội dung phản hồi từ server.  
    * **Luồng sự kiện thay thế (Alternative Flows/Exceptions):**  
      * **3.3.1.A. Tên đăng nhập không tồn tại:**  
        * Tại bước 6a, User Service không tìm thấy người dùng với tên đăng nhập cung cấp.  
        * User Service trả về lỗi "Tên đăng nhập hoặc mật khẩu không chính xác." (để tránh tiết lộ tài khoản nào tồn tại).  
        * Client hiển thị thông báo lỗi.  
      * **3.3.1.B. Mật khẩu không chính xác:**  
        * Tại bước 6b, mật khẩu cung cấp không khớp với mật khẩu lưu trữ.  
        * User Service trả về lỗi "Tên đăng nhập hoặc mật khẩu không chính xác."  
        * Client hiển thị thông báo lỗi.  
      * **3.3.1.C. Lỗi kết nối hoặc dịch vụ không khả dụng:**  
        * Nếu Client không thể kết nối đến API Gateway, hoặc API Gateway không thể kết nối đến User Service.  
        * Client hiển thị thông báo lỗi chung như "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."  
  * **3.3.2. Nghiệp vụ: Gửi Tin nhắn (Chat 1-1)**  
    * **Mã Nghiệp vụ:** UC-SENDMSG  
    * **Tác nhân:** Người gửi (Client A \- ReactJs), Người nhận (Client B \- ReactJs), Dịch vụ Thời gian thực & Thông báo (RNS), Dịch vụ Nhắn tin (MS), Apache Kafka.  
    * **Mục tiêu:** Cho phép Người gửi (A) gửi một tin nhắn văn bản cho Người nhận (B) và tin nhắn này được lưu trữ và hiển thị cho Người nhận (B) trong thời gian thực (nếu B trực tuyến).  
    * **Điều kiện tiên quyết:**  
      1. Người gửi (A) đã đăng nhập thành công vào ứng dụng.  
      2. Người gửi (A) đã thiết lập kết nối WebSocket ổn định với RNS.  
      3. Người nhận (B) là một người dùng hợp lệ trong hệ thống.  
      4. Các thành phần hệ thống liên quan (Client A, RNS, Kafka, MS, Client B (nếu trực tuyến)) đang hoạt động bình thường.  
    * **Kết quả thành công (Postconditions \- Success):**  
      1. Tin nhắn từ Người gửi (A) được RNS tiếp nhận.  
      2. Tin nhắn được xuất bản lên Kafka để xử lý bất đồng bộ.  
      3. Tin nhắn được Dịch vụ Nhắn tin (MS) lưu trữ vào cơ sở dữ liệu.  
      4. Nếu Người nhận (B) đang trực tuyến và kết nối WebSocket với RNS, tin nhắn được gửi đến Client B và hiển thị trên giao diện của B.  
      5. Client A nhận được phản hồi về trạng thái của tin nhắn (ví dụ: đã gửi đến máy chủ, đã lưu trữ, đã được Người nhận B đọc \- nếu có triển khai).  
    * **Kết quả thất bại (Postconditions \- Failure):**  
      1. Tin nhắn không được gửi đi từ Client A hoặc không được RNS tiếp nhận.  
      2. Tin nhắn không được lưu trữ bởi MS.  
      3. Client A nhận được thông báo lỗi về việc gửi tin nhắn thất bại.  
    * **Luồng sự kiện chính (Main Flow):**  
      1. Người dùng A (Client A) đang trong giao diện chat với Người dùng B, soạn nội dung tin nhắn và nhấn nút "Gửi".  
      2. Client A gửi một thông điệp WebSocket đến RNS qua đích /app/chat.sendMessage. Thông điệp chứa các thông tin như recipientId (ID của Người dùng B) và content (nội dung tin nhắn).  
      3. RNS nhận thông điệp WebSocket từ Client A: a. Xác thực Người dùng A dựa trên phiên WebSocket hiện tại. b. Tạo một đối tượng tin nhắn đầy đủ, bao gồm messageId (ID tin nhắn duy nhất), senderId (ID của Người dùng A), recipientId, content, và timestamp. c. Xuất bản đối tượng tin nhắn này lên một chủ đề Kafka được chỉ định (ví dụ: new\_raw\_messages). d. (Tùy chọn) RNS có thể gửi một xác nhận "lạc quan" (optimistic acknowledgement) ngay lập tức trở lại Client A qua WebSocket (ví dụ: đến đích /topic/messages/ack/{UserA\_ID}), thông báo rằng tin nhắn đã được máy chủ tiếp nhận (ví dụ: trạng thái "SENT\_TO\_SERVER").  
      4. Dịch vụ Nhắn tin (MS), với vai trò là một consumer, lắng nghe và tiêu thụ tin nhắn từ chủ đề Kafka new\_raw\_messages: a. Thực hiện các bước xác thực cần thiết cho tin nhắn (ví dụ: kiểm tra tính hợp lệ của senderId, recipientId). b. Lưu trữ đối tượng tin nhắn vào cơ sở dữ liệu của MS (ví dụ: Cassandra hoặc MongoDB). c. Sau khi lưu trữ thành công, MS xuất bản một sự kiện "tin nhắn đã lưu trữ" lên một chủ đề Kafka khác (ví dụ: persisted\_messages). Sự kiện này chứa thông tin chi tiết của tin nhắn đã được lưu và trạng thái "PERSISTED".  
      5. RNS (một consumer khác, hoặc cùng consumer nhưng xử lý loại sự kiện khác) lắng nghe và tiêu thụ sự kiện từ chủ đề Kafka persisted\_messages: a. Từ thông tin sự kiện, xác định recipientId (Người dùng B). b. Sử dụng Redis, tra cứu thông tin phiên WebSocket đang hoạt động của Người dùng B (ví dụ: kiểm tra xem UserB\_ID có đang kết nối với phiên bản RNS nào không). c. Nếu Người dùng B đang trực tuyến và có kết nối WebSocket đang hoạt động: i. RNS gửi tin nhắn (đã được lưu trữ) đến Client B thông qua kết nối WebSocket của B, trên một đích cụ thể (ví dụ: /topic/messages/{UserB\_ID}). d. (Tùy chọn) RNS có thể gửi một cập nhật trạng thái chi tiết hơn cho Client A (ví dụ: "đã lưu trữ" hoặc "đã gửi đến người nhận" \- nếu có thể xác định) qua WebSocket (ví dụ: đến đích /topic/messages/ack/{UserA\_ID}).  
      6. Client B (nếu trực tuyến) nhận được tin nhắn qua WebSocket và hiển thị nó trên giao diện chat với Người dùng A.  
      7. Client A nhận được (các) xác nhận/cập nhật trạng thái và cập nhật giao diện người dùng để hiển thị trạng thái của tin nhắn đã gửi (ví dụ: một dấu tick, hai dấu tick).  
    * **Luồng sự kiện thay thế (Alternative Flows/Exceptions):**  
      * **3.3.2.A. Người nhận B không trực tuyến:**  
        * Tại bước 5c, RNS không tìm thấy kết nối WebSocket đang hoạt động cho Người dùng B.  
        * Tin nhắn đã được lưu trữ trong MS. Hệ thống có thể kích hoạt luồng gửi thông báo đẩy (xem Nghiệp vụ 3.3.4).  
      * **3.3.2.B. Lỗi lưu trữ tin nhắn tại Dịch vụ Nhắn tin (MS):**  
        * Tại bước 4b, MS không thể lưu trữ tin nhắn vào cơ sở dữ liệu.  
        * Nếu Kafka được cấu hình với cơ chế thử lại (retry), MS có thể cố gắng lưu trữ lại tin nhắn.  
        * Nếu lỗi là vĩnh viễn, MS có thể xuất bản một sự kiện lỗi lên một chủ đề Kafka dành riêng cho lỗi. RNS có thể tiêu thụ sự kiện lỗi này và thông báo cho Client A về việc gửi tin nhắn thất bại.  
      * **3.3.2.C. RNS không thể xuất bản tin nhắn lên Kafka new\_raw\_messages:**  
        * Tại bước 3c, nếu RNS gặp lỗi khi gửi tin nhắn đến Kafka.  
        * RNS nên ghi log lỗi và có thể gửi thông báo lỗi trở lại Client A qua WebSocket.  
      * **3.3.2.D. Mất kết nối WebSocket của Client A trong quá trình gửi:**  
        * Nếu kết nối WebSocket của Client A bị ngắt trước khi nhận được xác nhận cuối cùng, tin nhắn có thể đã được xử lý một phần hoặc toàn bộ ở phía server. Khi Client A kết nối lại, cần có cơ chế đồng bộ hóa tin nhắn.  
      * **3.3.2.E. Kafka không khả dụng:**  
        * Nếu Kafka không hoạt động, các bước 3c, 4a, 4c, 5a sẽ thất bại. Hệ thống cần có cơ chế xử lý lỗi phù hợp, có thể tạm dừng chấp nhận tin nhắn mới hoặc thông báo lỗi cho người dùng.  
  *   
  * **Luồng Gửi Tin nhắn vào Nhóm (Send Message to Group Flow)**  
  * **Luồng này mô tả quá trình khi một người dùng (Người gửi) gửi một tin nhắn đến một cuộc trò chuyện nhóm.**  
  *   
  * **Client (ReactJS \- Người gửi):**  
  *   
  * **Người dùng soạn tin nhắn trong giao diện chat của một nhóm cụ thể.**  
  * **Client chuẩn bị payload tin nhắn bao gồm: groupId (ID của nhóm), content (nội dung tin nhắn), contentType (ví dụ: 'text', 'image'), và có thể cả clientMessageId (ID tin nhắn tạm thời do client tạo để theo dõi).**  
  * **Client gửi tin nhắn này thông qua kết nối WebSocket đến một endpoint STOMP được quản lý bởi Real-time & Notification Service (RNS) (ví dụ: /app/chat.sendGroupMessage). Kèm theo là token xác thực của người dùng (thường đã được thiết lập trong WebSocket session).**  
  * **Real-time & Notification Service (RNS \- WebSocket Handler):**  
  *   
  * **Nhận tin nhắn từ WebSocket.**  
  * **Xác thực người dùng dựa trên thông tin trong WebSocket session.**  
  * **Validate payload tin nhắn (groupId, content không được trống).**  
  * **Chuyển tiếp tin nhắn này đến Messaging Service (MS) để xử lý logic nghiệp vụ và lưu trữ. Việc chuyển tiếp có thể thực hiện qua:**  
  * **Một Kafka topic riêng cho tin nhắn nhóm đầu vào (ví dụ: raw\_group\_messages\_input). RNS publish tin nhắn vào topic này.**  
  * **Hoặc gọi một API nội bộ của MS (ít ưu tiên hơn nếu muốn decoupling hoàn toàn).**  
  * **Messaging Service (MS):**  
  *   
  * **Consume tin nhắn từ topic raw\_group\_messages\_input trên Kafka (nếu RNS publish qua Kafka).**  
  * **Xác thực quyền gửi tin nhắn vào nhóm:**  
  * **Kiểm tra xem senderId (lấy từ thông tin xác thực) có phải là thành viên của groupId và có quyền gửi tin nhắn không. Thông tin thành viên nhóm được MS quản lý trong cơ sở dữ liệu của mình (ví dụ: MongoDB lưu trữ collection groups với danh sách members).**  
  * **Xử lý và Lưu trữ Tin nhắn:**  
  * **Tạo messageId duy nhất cho tin nhắn.**  
  * **Gán timestamp, senderId.**  
  * **Lưu tin nhắn vào cơ sở dữ liệu của MS (ví dụ: MongoDB, trong collection group\_messages hoặc một collection chung messages có trường groupId). Trạng thái ban đầu của tin nhắn là "sent\_to\_server" hoặc tương tự.**  
  * **Publish Sự kiện "Tin nhắn Nhóm Mới":**  
  * **MS publish một sự kiện new\_group\_message\_persisted lên một Kafka topic chung cho các sự kiện tin nhắn (ví dụ: chat\_events hoặc một topic riêng group\_message\_events).**  
  * **Payload của sự kiện này bao gồm đầy đủ thông tin: messageId, groupId, senderId, senderUsername (có thể lấy từ User Service hoặc cache), content, contentType, timestamp.**  
  * **(Tùy chọn) Gửi Xác nhận cho Người gửi: MS có thể gửi một xác nhận (acknowledgment) ngược lại cho RNS (ví dụ qua một Kafka topic phản hồi hoặc Redis Pub/Sub) để RNS thông báo cho client người gửi rằng tin nhắn đã được MS xử lý và lưu trữ.**  
  * **Real-time & Notification Service (RNS \- Message Fan-out & Notification Logic):**  
  *   
  * **RNS (một consumer riêng hoặc một phần của RNS) consume sự kiện new\_group\_message\_persisted từ Kafka topic group\_message\_events.**  
  * **Lấy Danh sách Thành viên Nhóm:**  
  * **Từ groupId trong sự kiện, RNS truy vấn MS (qua API nội bộ, ví dụ: GET /api/internal/groups/{groupId}/members) hoặc cơ sở dữ liệu của chính RNS (nếu có cache/bản sao thông tin thành viên) để lấy danh sách tất cả memberId của nhóm đó.**  
  * **Phân phối Tin nhắn cho Thành viên (Fan-out):**  
  * **Với mỗi memberId trong danh sách thành viên (trừ senderId nếu không muốn người gửi nhận lại tin nhắn mình vừa gửi qua luồng này):**  
  * **Kiểm tra Trạng thái Trực tuyến: RNS kiểm tra trạng thái online của memberId (ví dụ: từ Redis nơi lưu trữ mapping userId \-\> websocket\_session\_info hoặc user\_presence\_status).**  
  * **Nếu Thành viên Trực tuyến (Online):**  
  * **RNS gửi tin nhắn đến client của memberId đó thông qua kết nối WebSocket đang hoạt động của họ (ví dụ: đến kênh /user/{memberId}/queue/messages). Payload tin nhắn sẽ bao gồm groupId để client biết tin nhắn này thuộc nhóm nào.**  
  * **Nếu Thành viên Ngoại tuyến (Offline) hoặc Gửi WebSocket Thất bại:**  
  * **RNS kích hoạt luồng gửi Push Notification.**  
  * **RNS lấy device token(s) của memberId (từ DB của RNS hoặc User Service nơi lưu trữ device tokens).**  
  * **RNS gửi yêu cầu đến dịch vụ Push Notification của bên thứ ba (FCM cho Android/Web, APNS cho iOS) với nội dung thông báo (ví dụ: "Nhóm X: \[Tên người gửi\] đã gửi một tin nhắn") và payload chứa groupId, messageId để client có thể điều hướng đến đúng cuộc trò chuyện khi mở thông báo.**  
  * **Client (ReactJS \- Các Thành viên Nhóm):**  
  *   
  * **Nhận Tin nhắn (Nếu Online):**  
  * **Client của các thành viên nhóm đang trực tuyến sẽ nhận được tin nhắn mới qua WebSocket trên kênh /user/{memberId}/queue/messages.**  
  * **Giao diện ReactJS cập nhật, hiển thị tin nhắn mới trong cửa sổ chat của nhóm tương ứng.**  
  * **Nhận Push Notification (Nếu Offline):**  
  * **Client của các thành viên nhóm đang ngoại tuyến sẽ nhận được push notification trên thiết bị của họ.**  
  * **Khi người dùng tương tác với thông báo, ứng dụng mở ra và có thể tải lịch sử tin nhắn mới cho nhóm đó.**  
  * **Client (ReactJS \- Người gửi):**  
  *   
  * **Sau khi RNS nhận được xác nhận từ MS (bước 3), hoặc ngay sau khi gửi qua WebSocket (bước 1, tùy theo thiết kế UX), giao diện của người gửi có thể cập nhật trạng thái tin nhắn thành "đã gửi" hoặc hiển thị tick tương ứng.**  
  * **Người gửi không nhận lại tin nhắn của chính mình qua luồng fan-out ở bước 4 (trừ khi có yêu cầu đặc biệt), vì tin nhắn đã được hiển thị trên UI của họ ngay khi họ nhấn gửi.**  
  * **Công nghệ sử dụng trong luồng này:**  
  *   
  * **ReactJS: Gửi và nhận tin nhắn nhóm trên giao diện người dùng.**  
  * **WebSocket (qua RNS): Kênh giao tiếp real-time chính để gửi tin nhắn từ client lên server và từ server xuống các client thành viên nhóm.**  
  * **RNS (Real-time & Notification Service): Quản lý kết nối WebSocket, nhận tin nhắn ban đầu, điều phối việc gửi push notification, và fan-out tin nhắn đến các thành viên online.**  
  * **MS (Messaging Service): Xử lý logic nghiệp vụ cốt lõi của tin nhắn nhóm, kiểm tra quyền, lưu trữ tin nhắn vào cơ sở dữ liệu, quản lý thông tin nhóm và thành viên.**  
  * **Kafka:**  
  * **Topic raw\_group\_messages\_input (tùy chọn): Nhận tin nhắn nhóm từ RNS chuyển sang MS.**  
  * **Topic group\_message\_events (hoặc chat\_events): MS publish sự kiện tin nhắn nhóm đã được lưu, để RNS và có thể các service khác (ví dụ: analytics) consume.**  
  * **MongoDB (trong MS): Lưu trữ thông tin tin nhắn nhóm, chi tiết nhóm và danh sách thành viên.**  
  * **Redis (sử dụng bởi RNS/User Service): Lưu trữ trạng thái hiện diện (online/offline) của người dùng, có thể cả thông tin session WebSocket.**  
  * **FCM/APNS: Dịch vụ gửi push notification của bên thứ ba.**  
  * **Luồng này đảm bảo tính bất đồng bộ, khả năng mở rộng và khả năng phục hồi lỗi nhờ việc sử dụng Kafka để điều phối sự kiện giữa các service. Nó cũng tách biệt rõ ràng trách nhiệm giữa RNS (xử lý giao tiếp real-time và notification) và MS (xử lý logic nghiệp vụ và dữ liệu tin nhắn).**  
  * **3.3.3. Nghiệp vụ: Cập nhật và Hiển thị Trạng thái Hiện diện Người dùng**  
    * **Mã Nghiệp vụ:** UC-PRESENCE  
    * **Tác nhân:** Người dùng (Client A \- ReactJs), Dịch vụ Thời gian thực & Thông báo (RNS), Apache Kafka, Redis, Các Liên hệ của Người dùng A (Clients).  
    * **Mục tiêu:** Cập nhật trạng thái hiện diện (ví dụ: trực tuyến, ngoại tuyến, đang gõ) của một người dùng và thông báo trạng thái này cho các liên hệ của họ trong thời gian thực.  
    * **Điều kiện tiên quyết:**  
      1. Người dùng A đã đăng nhập vào ứng dụng.  
      2. Client A có khả năng thiết lập và duy trì kết nối WebSocket với RNS.  
      3. Người dùng A có một danh sách các liên hệ trong hệ thống.  
      4. Các thành phần hệ thống liên quan (Client A, RNS, Kafka, Redis, Clients của các liên hệ) đang hoạt động bình thường.  
    * **Kết quả thành công (Postconditions \- Success):**  
      1. Trạng thái hiện diện của Người dùng A được cập nhật chính xác trong Redis (ví dụ: "online", "offline", thông tin "typing" cho một cuộc trò chuyện cụ thể).  
      2. Một sự kiện về thay đổi trạng thái hiện diện được xuất bản lên Kafka.  
      3. Các liên hệ của Người dùng A đang trực tuyến và kết nối WebSocket với RNS nhận được thông báo cập nhật về trạng thái hiện diện của Người dùng A.  
      4. Giao diện người dùng của các liên hệ được cập nhật để hiển thị trạng thái mới của Người dùng A.  
    * **Kết quả thất bại (Postconditions \- Failure):**  
      1. Trạng thái hiện diện của Người dùng A không được cập nhật hoặc không được thông báo chính xác.  
      2. Các liên hệ không nhận được thông tin cập nhật hoặc nhận thông tin sai lệch.  
    * **Luồng sự kiện chính (Người dùng A chuyển sang trạng thái "Trực tuyến"):**  
      1. Khi Người dùng A đăng nhập thành công hoặc khởi chạy ứng dụng, Client A chủ động thiết lập một kết nối WebSocket với RNS.  
      2. RNS, sau khi quá trình handshake WebSocket thành công và xác thực Người dùng A: a. Cập nhật trạng thái hiện diện của Người dùng A trong Redis thành "online". Ví dụ: SET user:UserA\_ID:presence online EX 300 (có thể đặt thời gian hết hạn để client cần gửi tín hiệu "heartbeat" định kỳ để duy trì trạng thái "online"). b. Lưu trữ thông tin về phiên WebSocket đang hoạt động của Người dùng A vào Redis (ví dụ: SADD user:UserA\_ID:sessions \<session\_id\_A\>), giúp RNS định tuyến các tin nhắn sau này. c. Xuất bản một sự kiện "cập nhật trạng thái hiện diện" lên chủ đề Kafka presence\_updates. Payload của sự kiện chứa userId (ID của Người dùng A), status ("online"), và timestamp.  
      3. RNS (một tiến trình consumer riêng hoặc một luồng logic khác trong RNS) tiêu thụ sự kiện từ chủ đề Kafka presence\_updates: a. Từ sự kiện, lấy userId của Người dùng A. b. Truy xuất danh sách liên hệ của Người dùng A (có thể thông qua một lệnh gọi API đến User Service, hoặc RNS đã cache/đăng ký thông tin này từ trước, ví dụ trong Redis). c. Đối với mỗi liên hệ trong danh sách: i. Sử dụng Redis, tra cứu xem liên hệ đó có đang trực tuyến và có (các) kết nối WebSocket nào đang hoạt động với RNS không. ii. Nếu liên hệ đang trực tuyến, RNS gửi một thông báo cập nhật trạng thái hiện diện của Người dùng A đến (các) client của liên hệ đó qua (các) kết nối WebSocket tương ứng, trên một đích cụ thể (ví dụ: /topic/presence/{contact\_userId}). Payload chứa userId (của Người dùng A) và status ("online").  
      4. Client của các liên hệ (đang trực tuyến) nhận được thông báo cập nhật trạng thái qua WebSocket và cập nhật giao diện người dùng để hiển thị rằng Người dùng A đang "online".  
    * **Luồng sự kiện thay thế (Alternative Flows/Exceptions):**  
      * **3.3.3.A. Người dùng A chuyển sang trạng thái "Ngoại tuyến":**  
        1. Khi Người dùng A đăng xuất, đóng ứng dụng, hoặc kết nối WebSocket bị ngắt đột ngột (ví dụ: mất mạng).  
        2. RNS phát hiện việc ngắt kết nối WebSocket: a. Cập nhật trạng thái hiện diện của Người dùng A trong Redis thành "offline". b. Xóa thông tin phiên WebSocket của Người dùng A khỏi Redis. c. Xuất bản sự kiện "cập nhật trạng thái hiện diện" lên chủ đề Kafka presence\_updates với status ("offline").  
        3. Các bước tiếp theo (3 và 4 của luồng chính) được thực hiện để thông báo cho các liên hệ rằng Người dùng A đã "offline".  
      * **3.3.3.B. Người dùng A đang gõ tin nhắn (Typing Indicator):**  
        1. Khi Người dùng A bắt đầu gõ tin nhắn trong một cuộc trò chuyện với Người dùng B (hoặc trong một nhóm), Client A gửi một sự kiện "typing\_started" qua WebSocket đến RNS, đích /app/chat.typing. Payload chứa recipientId (hoặc groupId) và isTyping: true.  
        2. Khi Người dùng A ngừng gõ (hoặc gửi tin nhắn), Client A gửi sự kiện "typing\_stopped" với isTyping: false.  
        3. RNS nhận các sự kiện này: a. **Cách 1 (Qua Kafka):** Xuất bản sự kiện lên một chủ đề Kafka (ví dụ: typing\_events). Một consumer khác của RNS sẽ đọc và gửi đến client đích. Cách này đảm bảo hơn nhưng có độ trễ cao hơn. b. **Cách 2 (Qua Redis Pub/Sub \- ưu tiên cho độ trễ thấp):** RNS trực tiếp sử dụng Redis Pub/Sub để phát sóng sự kiện "typing" này đến một kênh mà các client liên quan (Người dùng B hoặc thành viên nhóm) đang lắng nghe (nếu họ kết nối cùng cụm RNS). c. **Cách 3 (Gửi trực tiếp qua WebSocket):** RNS tra cứu (các) kết nối WebSocket của người nhận/thành viên nhóm và gửi trực tiếp thông báo "typing" qua WebSocket.  
        4. Client của người nhận/thành viên nhóm nhận được sự kiện và hiển thị/ẩn chỉ báo "đang gõ" trên giao diện.  
      * **3.3.3.C. Lỗi cập nhật trạng thái trong Redis hoặc xuất bản lên Kafka:**  
        * Nếu RNS không thể cập nhật Redis hoặc xuất bản lên Kafka (ví dụ: do lỗi kết nối, dịch vụ không khả dụng).  
        * RNS nên ghi log lỗi. Trạng thái hiện diện của người dùng có thể không được cập nhật hoặc thông báo một cách chính xác cho các liên hệ. Cần có cơ chế theo dõi và cảnh báo cho những lỗi như vậy.  
  * **3.3.4. Nghiệp vụ: Nhận Thông báo Tin nhắn Mới**  
    * **Mã Nghiệp vụ:** UC-RECEIVENOTIF  
    * **Tác nhân:** Người nhận (Client B \- ReactJs), Dịch vụ Thời gian thực & Thông báo (RNS), Apache Kafka, (Tùy chọn) Dịch vụ Thông báo Đẩy bên ngoài (ví dụ: Firebase Cloud Messaging \- FCM, Apple Push Notification service \- APNS).  
    * **Mục tiêu:** Đảm bảo Người nhận (B) được thông báo về một tin nhắn mới đã được gửi cho họ, thông qua các kênh phù hợp tùy thuộc vào trạng thái hoạt động của họ trên ứng dụng.  
    * **Điều kiện tiên quyết:**  
      1. Một tin nhắn mới đã được gửi đến Người dùng B.  
      2. Sự kiện persisted\_messages (chứa thông tin tin nhắn đã được lưu trữ) đã được RNS tiêu thụ từ Kafka (như mô tả trong bước 5 của Nghiệp vụ 3.3.2).  
      3. Các thành phần hệ thống liên quan (RNS, Kafka, Client B (nếu trực tuyến), Dịch vụ Thông báo Đẩy (nếu sử dụng)) đang hoạt động bình thường.  
    * **Kết quả thành công (Postconditions \- Success):**  
      1. Nếu Client B đang mở ứng dụng và đang xem cuộc trò chuyện với người gửi, tin nhắn mới được hiển thị trực tiếp trong cuộc trò chuyện.  
      2. Nếu Client B đang mở ứng dụng nhưng không xem cuộc trò chuyện đó, một thông báo trong ứng dụng (ví dụ: badge, toast notification) được hiển thị.  
      3. Nếu Client B không mở ứng dụng (ví dụ: tab trình duyệt đã đóng, ứng dụng chạy nền trên di động), một thông báo đẩy của trình duyệt/hệ điều hành được gửi đến thiết bị của B (nếu B đã cho phép nhận thông báo đẩy).  
    * **Kết quả thất bại (Postconditions \- Failure):**  
      1. Người nhận B không nhận được thông báo về tin nhắn mới qua bất kỳ kênh nào.  
      2. Thông báo bị trễ hoặc không chính xác.  
    * **Luồng sự kiện chính (Sau khi RNS đã tiêu thụ sự kiện persisted\_messages cho Người dùng B):**  
      1. **Xử lý Thông báo trong ứng dụng (In-app Notification):** a. Như một phần của luồng gửi tin nhắn (Nghiệp vụ 3.3.2, bước 5c), nếu Người dùng B đang trực tuyến và có kết nối WebSocket, RNS đã gửi tin nhắn đến Client B qua WebSocket đích /topic/messages/{UserB\_ID}. b. Client B (ReactJs) nhận được tin nhắn qua WebSocket: i. Nếu cửa sổ chat hiện tại đang mở là cuộc trò chuyện với người gửi tin nhắn đó, Client B hiển thị tin nhắn mới trực tiếp vào luồng chat. ii. Nếu cửa sổ chat hiện tại không phải là cuộc trò chuyện đó, hoặc người dùng đang ở một phần khác của ứng dụng, Client B hiển thị một chỉ báo thông báo trong ứng dụng (ví dụ: một con số trên biểu tượng tin nhắn, một thông báo nhỏ dạng "toast" ở góc màn hình).  
      2. **Xử lý Thông báo Đẩy của Trình duyệt/Hệ điều hành (Push Notification):** a. Sau khi RNS tiêu thụ sự kiện persisted\_messages từ Kafka, nó kiểm tra trạng thái kết nối WebSocket của Người dùng B (sử dụng Redis). b. Nếu RNS xác định rằng Người dùng B **không** có kết nối WebSocket đang hoạt động (nghĩa là người dùng không tích cực sử dụng ứng dụng trên tab hiện tại): i. RNS kiểm tra xem Người dùng B có đăng ký nhận thông báo đẩy hay không. Thông tin đăng ký này (ví dụ: token thiết bị, endpoint của service worker) thường được Client B gửi lên và lưu trữ ở phía server (ví dụ: trong cơ sở dữ liệu của User Service hoặc một bảng chuyên dụng mà RNS có thể truy cập). ii. Nếu Người dùng B đã đăng ký và cho phép nhận thông báo đẩy: 1\. RNS chuẩn bị nội dung cho thông báo đẩy (ví dụ: tên người gửi, một đoạn trích ngắn của tin nhắn, tiêu đề ứng dụng). 2\. RNS gửi yêu cầu tạo thông báo đẩy này đến một dịch vụ thông báo đẩy bên ngoài (ví dụ: FCM cho Android/Web, APNS cho iOS). *(Chi tiết kỹ thuật: RNS có thể trực tiếp gọi API của dịch vụ đẩy, hoặc xuất bản một yêu cầu lên một chủ đề Kafka khác như push\_notification\_requests. Một thành phần chuyên biệt trong RNS, hoặc một microservice riêng (nếu có), sẽ tiêu thụ từ chủ đề này và thực hiện việc gửi thông báo đẩy.)* c. Dịch vụ thông báo đẩy bên ngoài sẽ gửi thông báo đến thiết bị của Người dùng B. d. Hệ điều hành/Trình duyệt trên thiết bị của Người dùng B nhận và hiển thị thông báo đẩy cho người dùng (ví dụ: trên màn hình khóa, thanh thông báo).  
    * **Luồng sự kiện thay thế (Alternative Flows/Exceptions):**  
      * **3.3.4.A. Người dùng B đã tắt thông báo:**  
        * Nếu Người dùng B đã cấu hình trong ứng dụng để tắt thông báo trong ứng dụng cho cuộc trò chuyện cụ thể hoặc tất cả các cuộc trò chuyện, Client B sẽ không hiển thị thông báo trong ứng dụng (bước 1.b.ii).  
        * Nếu Người dùng B không cho phép ứng dụng gửi thông báo đẩy ở cấp độ hệ điều hành/trình duyệt, RNS sẽ không thể gửi thông báo đẩy hoặc dịch vụ đẩy sẽ không thể gửi đến thiết bị (bước 2.b.ii).  
      * **3.3.4.B. Lỗi khi gửi thông báo đẩy:**  
        * Nếu RNS gặp lỗi khi giao tiếp với dịch vụ thông báo đẩy bên ngoài (ví dụ: token thiết bị không hợp lệ, dịch vụ đẩy không khả dụng).  
        * RNS nên ghi log lỗi. Người dùng B có thể không nhận được thông báo đẩy.  
      * **3.3.4.C. Thông tin đăng ký thông báo đẩy không hợp lệ hoặc đã hết hạn:**  
        * Tại bước 2.b.ii.2, nếu token thiết bị không còn hợp lệ, dịch vụ đẩy sẽ báo lỗi. Cần có cơ chế để Client cập nhật token thiết bị khi nó thay đổi.  
* **3.4. Xử lý Bất đồng bộ với Kafka và Redis (Asynchronous Processing with Kafka and Redis)**Việc sử dụng Kafka và Redis một cách hiệu quả là chìa khóa cho hiệu suất và khả năng phục hồi của hệ thống.  
  * **Vai trò của Kafka**:  
    * **Tách rời (Decoupling)**: Các dịch vụ không cần biết trực tiếp về nhau. RNS xuất bản tin nhắn thô; MS tiêu thụ chúng. MS xuất bản tin nhắn đã lưu trữ; RNS tiêu thụ chúng để gửi đi. Điều này cải thiện khả năng phục hồi; nếu MS chậm hoặc ngừng hoạt động, RNS vẫn có thể chấp nhận tin nhắn và Kafka sẽ đệm chúng.  
    * **Cân bằng tải (Load Balancing)**: Kafka phân phối tin nhắn giữa các consumer trong một nhóm consumer, hỗ trợ khả năng mở rộng của MS và RNS.  
    * **Nguồn sự kiện (Event Sourcing)**: Các chủ đề Kafka hoạt động như một nhật ký các sự kiện (tin nhắn mới, thay đổi trạng thái hiện diện, v.v.), cho phép các dịch vụ khác nhau phản ứng một cách độc lập. Điều này là chìa khóa cho thông báo và cập nhật thời gian thực.  
    * **Khả năng phục hồi (Resilience)**: Tính bền vững của Kafka đảm bảo tin nhắn không bị mất trong các lỗi tạm thời.  
  * **Vai trò của Redis**:  
    * **Quản lý Trạng thái Nhanh (Fast State Management)**: Cần thiết cho các tính năng thời gian thực. Lưu trữ ID phiên WebSocket cho phép bất kỳ phiên bản RNS nào tìm thấy nơi gửi tin nhắn. Trạng thái hiện diện trong Redis có thể truy cập nhanh chóng.  
    * **Caching**: Mặc dù không phải là vai trò chính ở đây đối với tin nhắn (Kafka và DB của MS xử lý việc đó), Redis có thể cache các đoạn trích hồ sơ người dùng hoặc danh sách liên hệ trong RNS để tránh các lệnh gọi thường xuyên đến Dịch vụ Người dùng trong quá trình phát sóng tin nhắn.  
    * **Tín hiệu Thời gian thực (Pub/Sub) (Real-time Signaling)**: Đối với các sự kiện tần suất rất cao, độ trễ rất thấp, có khả năng tạm thời (như chỉ báo đang gõ trong một nhóm nhỏ, hoặc các tín hiệu nội bộ trong cụm RNS), Redis Pub/Sub cung cấp một giải pháp thay thế nhẹ nhàng cho Kafka. Điều này bổ sung cho Kafka, vốn tốt hơn cho việc truyền sự kiện liên dịch vụ, bền vững.

Cả Kafka và Redis (thông qua Pub/Sub) đều có thể được sử dụng để phân phối các sự kiện thời gian thực, và người dùng đã yêu cầu cả hai. Điều này đặt ra câu hỏi làm thế nào để quyết định nên sử dụng công cụ nào cho loại sự kiện nào, liệu có sự chồng chéo hay sự phân định rõ ràng. Kafka vượt trội khi độ bền, đảm bảo gửi (ít nhất một lần), và việc tiêu thụ bởi nhiều microservices khác nhau, có khả năng khác nhau là yếu tố then chốt. Ví dụ: lưu trữ tin nhắn thô, thông báo tin nhắn đã lưu trữ, thay đổi trạng thái hiện diện chính (trực tuyến/ngoại tuyến). Redis Pub/Sub phù hợp hơn cho các kịch bản "gửi và quên" (fire-and-forget) nơi độ trễ cực thấp là tối quan trọng, sự kiện được tiêu thụ bởi các phiên bản của *cùng một* dịch vụ (cụm RNS), và việc mất tin nhắn không thường xuyên có thể chấp nhận được hoặc được xử lý bằng các phương tiện khác. Ví dụ: chỉ báo đang gõ, lan truyền xác nhận đã đọc trong RNS trước khi Kafka xác nhận. Việc sử dụng Redis Pub/Sub cho mọi thứ mà Kafka có thể làm có thể làm phức tạp quá mức vai trò của Redis và làm mất đi những lợi ích của Kafka. Ngược lại, việc đẩy các sự kiện tần suất cực cao, giá trị thấp qua Kafka có thể gây thêm chi phí không cần thiết. Do đó, cần có hướng dẫn rõ ràng về thời điểm chọn Kafka so với Redis Pub/Sub trong RNS. Kafka cho luồng sự kiện cốt lõi, đáng tin cậy. Redis Pub/Sub cho các cải tiến chiến thuật, độ trễ cực thấp hoặc giao tiếp nội bộ cụm RNS.  
**IV. Kết luận và Khuyến nghị (Conclusion and Recommendations)**

* **Tóm tắt các giải pháp đã đề xuất**: Báo cáo này đã trình bày một kiến trúc microservices gồm ba dịch vụ chính: Dịch vụ Người dùng, Dịch vụ Nhắn tin, và Dịch vụ Thời gian thực & Thông báo, để xây dựng một ứng dụng chat web. ReactJs được đề xuất cho frontend, trong khi Spring Boot là nền tảng cho backend. WebSockets (với STOMP) được chọn cho giao tiếp thời gian thực. Apache Kafka đóng vai trò là message broker trung tâm cho giao tiếp bất đồng bộ và xử lý sự kiện, còn Redis được sử dụng cho quản lý trạng thái nhanh, caching và pub/sub cục bộ. Các thiết kế API chi tiết và luồng xử lý cho các nghiệp vụ cốt lõi cũng đã được phác thảo.  
* **Các bước tiếp theo và các điểm cần cân nhắc khi triển khai (Next Steps and Considerations for Implementation)**:  
  * **Khả năng mở rộng (Scalability)**:  
    * Lên kế hoạch cho việc mở rộng theo chiều ngang của từng microservice, đặc biệt là Dịch vụ Thời gian thực & Thông báo, do đây là điểm tập trung của các tương tác người dùng.  
    * Mở rộng cụm Kafka (brokers, partitions) khi lưu lượng tin nhắn tăng.  
    * Triển khai Redis cluster để đảm bảo tính sẵn sàng cao và phân phối tải.  
  * **Giám sát và Ghi nhật ký (Monitoring and Logging)**:  
    * Triển khai hệ thống ghi nhật ký tập trung (ví dụ: ELK stack \- Elasticsearch, Logstash, Kibana) và thu thập số liệu (ví dụ: Prometheus, Grafana) cho tất cả các microservices.  
    * Sử dụng distributed tracing (ví dụ: OpenZipkin, Jaeger) để theo dõi các yêu cầu qua các dịch vụ, giúp gỡ lỗi và phân tích hiệu suất.  
  * **Tăng cường Bảo mật (Security Enhancements)**:  
    * Thực hiện kiểm tra bảo mật định kỳ.  
    * Xác thực đầu vào (input validation) tại tất cả các điểm vào API.  
    * Cấu hình bảo mật cho Kafka và Redis (xác thực, ủy quyền, chính sách mạng).  
    * Nếu E2EE không được triển khai, đảm bảo mã hóa dữ liệu khi lưu trữ (data-at-rest encryption) mạnh mẽ cho cơ sở dữ liệu và TLS mạnh cho dữ liệu đang truyền (data-in-transit).  
    * Xem xét Content Security Policy (CSP), CORS và các header bảo mật web khác cho frontend ReactJs.  
  * **Kiểm thử (Testing)**:  
    * Xây dựng chiến lược kiểm thử toàn diện bao gồm unit test, integration test và end-to-end test.  
    * Thực hiện kiểm thử tải (load testing) cho các thành phần thời gian thực để đảm bảo hệ thống hoạt động ổn định dưới tải cao.  
  * **Triển khai (Deployment)**:  
    * Sử dụng các quy trình CI/CD (Continuous Integration/Continuous Deployment) để tự động hóa việc xây dựng và triển khai.  
    * Đóng gói ứng dụng bằng container (Docker) và điều phối bằng Kubernetes được khuyến nghị cao để quản lý microservices hiệu quả.  
  * **Tính nhất quán Dữ liệu (Data Consistency)**:  
    * Giải quyết các thách thức về tính nhất quán cuối cùng (eventual consistency) phát sinh từ mẫu "database per service" và giao tiếp bất đồng bộ. Triển khai các chiến lược để xử lý việc đối chiếu dữ liệu hoặc bồi thường (compensation) nếu cần.  
  * **Phiên bản API (API Versioning)**:  
    * Lên kế hoạch cho việc quản lý phiên bản API để quản lý các thay đổi mà không làm hỏng các client hiện có.

Một yếu tố quan trọng cho sự thành công của việc triển khai microservices là sự trưởng thành của công cụ dành cho nhà phát triển và quy trình DevOps. Kiến trúc được đề xuất bao gồm nhiều thành phần chuyển động (3 dịch vụ, Kafka, Redis, cơ sở dữ liệu), các luồng giao tiếp phức tạp và các công nghệ như WebSockets. Việc quản lý nhiều dịch vụ, brokers và cơ sở dữ liệu phức tạp hơn so với một ứng dụng nguyên khối. Do đó, tự động hóa thông qua CI/CD, kiểm thử tự động và cơ sở hạ tầng dưới dạng mã (infrastructure-as-code) trở nên cực kỳ quan trọng để phát triển, triển khai và quản lý hiệu quả. Việc gỡ lỗi các vấn đề trải dài trên nhiều dịch vụ đòi hỏi các công cụ ghi nhật ký, theo dõi và giám sát tốt. Đảm bảo các nhà phát triển có thể dễ dàng thiết lập môi trường cục bộ, chạy kiểm thử và hiểu các tương tác dịch vụ là chìa khóa cho năng suất. Do đó, việc đầu tư mạnh mẽ vào các thực hành và công cụ DevOps mạnh mẽ ngay từ đầu là rất cần thiết. Điều này bao gồm CI/CD, container hóa (Docker), điều phối (Kubernetes được đề xuất trong ), ghi nhật ký/giám sát tập trung và distributed tracing. Nếu không có những điều này, lợi ích của microservices có thể bị lu mờ bởi sự phức tạp trong vận hành.

#### **Nguồn trích dẫn**

1\. User Management: A Complete Guide \- Frontegg, https://frontegg.com/guides/user-management 2\. Chat app development in 2024: must-have features and those that add a competitive edge, https://www.rst.software/blog/chat-app-development-in-2024-must-have-features-and-those-that-add-a-competitive-edge 3\. Top 10 ứng dụng chat trên điện thoại thịnh hành nhất thế giới \- SENTO APP, https://sapp.vn/blog/top-10-ung-dung-chat-tren-dien-thoai-thinh-hanh-nhat-the-gioi-nam-2021/ 4\. How to Build a Real-Time Chat App Using Spring Boot and STOMP (WebSockets)?, https://stackoverflow.com/questions/79600806/how-to-build-a-real-time-chat-app-using-spring-boot-and-stomp-websockets 5\. 20 ứng dụng nhắn tin tốt nhất \- Cập nhật năm 2025 \- blinkvisa.com, https://blinkvisa.com/vi/-Blog-c%E1%BB%A7a-ch%C3%BAng-t%C3%B4i./tr%C3%B2-chuy%E1%BB%87n-b%C3%AD-m%E1%BA%ADt-a/%E1%BB%A9ng-d%E1%BB%A5ng-nh%E1%BA%AFn-tin-t%E1%BB%91t-nh%E1%BA%A5t/ 6\. Customize Chat Bubbles & Have Fun with Google Messages \- Android, https://www.android.com/google-messages/ 7\. Google Chat: Messaging and Team Collaboration, https://workspace.google.com/products/chat/ 8\. Chat API & In-App Messaging as a Service \- Best Real-time Platform \- GetStream.io, https://getstream.io/chat/ 9\. Chat thời gian thực là gì? (+ Dùng thử miễn phí) \- LiveAgent, https://www.liveagent.vn/tinh-nang/chat-thoi-gian-thuc/ 10\. Build Live Chat for your App with Pusher Channels, https://pusher.com/channels/use-cases/chat/ 11\. Microservices \- Rocket-Chat Documentation, https://docs.rocket.chat/docs/microservices 12\. How to Build Microservices for Real-Time Notifications with Java \- Springfuse, https://www.springfuse.com/real-time-notifications-in-java-microservices/ 13\. Design Notification Services | System Design \- GeeksforGeeks, https://www.geeksforgeeks.org/design-notification-services-system-design/ 14\. How to structure a notification system for a chat app using Firebase Database and Firebase Notification \- Stack Overflow, https://stackoverflow.com/questions/40090627/how-to-structure-a-notification-system-for-a-chat-app-using-firebase-database-an 15\. Pattern: Database per service \- Microservices.io, https://microservices.io/patterns/data/database-per-service.html 16\. Communication in a microservice architecture \- .NET | Microsoft Learn, https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/communication-in-microservice-architecture 17\. Interservice communication in microservices \- Azure Architecture Center | Microsoft Learn, https://learn.microsoft.com/en-us/azure/architecture/microservices/design/interservice-communication 18\. Microservices communications. Why you should switch to message queues., https://dev.to/matteojoliveau/microservices-communications-why-you-should-switch-to-message-queues--48ia 19\. Design A Chat System \- ByteByteGo | Technical Interview Prep, https://bytebytego.com/courses/system-design-interview/design-a-chat-system 20\. Microservices \- Spring, https://spring.io/microservices/ 21\. Database for real time chat app? : r/AskProgramming \- Reddit, https://www.reddit.com/r/AskProgramming/comments/1bmnwbi/database\_for\_real\_time\_chat\_app/ 22\. Microservices Communication with Apache Kafka in Spring Boot | GeeksforGeeks, https://www.geeksforgeeks.org/microservices-communication-with-apache-kafka-in-spring-boot/ 23\. Java Microservices and WebSockets: Building Real-Time Communication \- Springfuse, https://www.springfuse.com/real-time-communication-with-websockets/ 24\. Using WebSocket to Build an Interactive Web Application in Spring Boot | GeeksforGeeks, https://www.geeksforgeeks.org/using-websocket-to-build-an-interactive-web-application-in-spring-boot/ 25\. Getting Started | Messaging with Redis \- Spring, https://spring.io/guides/gs/messaging-redis/ 26\. Design architecture of a notification system \- Stack Overflow, https://stackoverflow.com/questions/75017090/design-architecture-of-a-notification-system 27\. Redis Cache and its use cases for Modern Application \- eInfochips, https://www.einfochips.com/blog/redis-cache-and-its-use-cases-for-modern-application/ 28\. Microservices Communication with Redis Streams, https://redis.io/learn/howtos/solutions/microservices/interservice-communication 29\. Apache Kafka®: 4 use cases and 4 real-life examples \- NetApp Instaclustr, https://www.instaclustr.com/education/apache-kafka/kafka-4-use-cases-and-4-real-life-examples/ 30\. Kafka Microservice Proper Use Cases \- Stack Overflow, https://stackoverflow.com/questions/56653429/kafka-microservice-proper-use-cases 31\. Redis for microservices Architecture, https://redis.io/solutions/microservices/