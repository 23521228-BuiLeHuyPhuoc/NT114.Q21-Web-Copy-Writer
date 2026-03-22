# Tìm Hiểu Self-Healing (Tự Phục Hồi) Trong Microsoft Azure

## Thông Tin Báo Cáo

- **Chủ đề:** Self-Healing trong Microsoft Azure – Cơ chế tự phục hồi hệ thống trên nền tảng đám mây
- **Mục tiêu:** Tìm hiểu khái niệm, kiến trúc, kịch bản thực hành và trình bày báo cáo môn học
- **Sinh viên thực hiện:** Bùi Lê Huy Phước

---

## Mục Lục

1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Khái niệm Self-Healing trong Cloud Computing](#2-khái-niệm-self-healing-trong-cloud-computing)
3. [Self-Healing trong Azure – Các dịch vụ liên quan](#3-self-healing-trong-azure--các-dịch-vụ-liên-quan)
4. [Azure App Service Auto-Healing](#4-azure-app-service-auto-healing)
5. [Azure Virtual Machine Scale Sets – Self-Healing](#5-azure-virtual-machine-scale-sets--self-healing)
6. [Azure Kubernetes Service (AKS) – Self-Healing Pods](#6-azure-kubernetes-service-aks--self-healing-pods)
7. [Azure Monitor & Alerts – Giám sát và tự động phản hồi](#7-azure-monitor--alerts--giám-sát-và-tự-động-phản-hồi)
8. [Azure Traffic Manager & Load Balancer – Failover tự động](#8-azure-traffic-manager--load-balancer--failover-tự-động)
9. [Kịch bản thực hành (Lab Scenarios)](#9-kịch-bản-thực-hành-lab-scenarios)
10. [Kế hoạch trình bày báo cáo](#10-kế-hoạch-trình-bày-báo-cáo)
11. [Tài liệu tham khảo](#11-tài-liệu-tham-khảo)

---

## 1. Giới Thiệu Tổng Quan

### 1.1 Đặt vấn đề

Trong môi trường Cloud Computing hiện đại, các hệ thống phải hoạt động liên tục 24/7. Khi xảy ra sự cố (crash ứng dụng, quá tải, lỗi phần cứng, lỗi mạng), việc phục hồi thủ công mất nhiều thời gian và có thể gây gián đoạn dịch vụ. **Self-Healing** (tự phục hồi) là khả năng hệ thống tự động phát hiện và khắc phục sự cố mà không cần sự can thiệp của con người.

### 1.2 Mục tiêu của Self-Healing

| Mục tiêu | Mô tả |
|-----------|-------|
| **High Availability** | Đảm bảo hệ thống luôn sẵn sàng phục vụ (uptime ≥ 99.9%) |
| **Fault Tolerance** | Chịu lỗi – hệ thống tiếp tục hoạt động khi có thành phần lỗi |
| **Auto Recovery** | Tự động khôi phục trạng thái bình thường sau sự cố |
| **Minimize Downtime** | Giảm thiểu thời gian ngừng hoạt động |
| **Reduce Human Intervention** | Giảm sự phụ thuộc vào quản trị viên |

### 1.3 Tại sao chọn Azure?

Microsoft Azure cung cấp một hệ sinh thái phong phú các dịch vụ hỗ trợ Self-Healing ở nhiều cấp độ:
- **Cấp ứng dụng:** App Service Auto-Healing, Azure Functions
- **Cấp hạ tầng:** Virtual Machine Scale Sets, Availability Sets
- **Cấp container:** Azure Kubernetes Service (AKS)
- **Cấp mạng:** Traffic Manager, Load Balancer, Front Door
- **Cấp giám sát:** Azure Monitor, Application Insights, Log Analytics

---

## 2. Khái Niệm Self-Healing Trong Cloud Computing

### 2.1 Định nghĩa

**Self-Healing** là khả năng của một hệ thống phân tán tự động phát hiện sự cố (failure detection), cô lập vấn đề (isolation), và thực hiện hành động khắc phục (remediation) mà không cần con người can thiệp.

### 2.2 Quy trình Self-Healing

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Monitor    │────▶│   Detect     │────▶│   Diagnose   │────▶│   Recover    │
│  (Giám sát) │     │ (Phát hiện)  │     │ (Chẩn đoán)  │     │ (Phục hồi)  │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       ▲                                                              │
       └──────────────────────────────────────────────────────────────┘
                              Feedback Loop
```

### 2.3 Các chiến lược Self-Healing phổ biến

| Chiến lược | Mô tả | Ví dụ Azure |
|-----------|-------|-------------|
| **Restart** | Khởi động lại service/process bị lỗi | App Service Auto-Healing restart |
| **Replace** | Thay thế instance lỗi bằng instance mới | VMSS automatic instance repair |
| **Scale Out** | Thêm instance mới khi quá tải | Autoscale trong App Service, VMSS |
| **Failover** | Chuyển traffic sang vùng khác khi vùng hiện tại lỗi | Traffic Manager, Azure Front Door |
| **Rollback** | Quay lại phiên bản trước khi bản deploy mới lỗi | Deployment slots, AKS rolling update |
| **Reconfigure** | Thay đổi cấu hình để khắc phục | Azure Automation Runbooks |
| **Retry** | Thử lại thao tác đã thất bại | Retry policies, Circuit Breaker pattern |

### 2.4 Design Patterns liên quan

1. **Retry Pattern** – Tự động thử lại khi gặp lỗi tạm thời (transient faults)
2. **Circuit Breaker Pattern** – Ngắt kết nối tạm thời đến dịch vụ lỗi để tránh cascading failure
3. **Health Endpoint Monitoring Pattern** – Expose endpoint `/health` để hệ thống giám sát kiểm tra trạng thái
4. **Queue-Based Load Leveling Pattern** – Sử dụng message queue để điều tiết tải
5. **Throttling Pattern** – Giới hạn request để bảo vệ dịch vụ khỏi quá tải
6. **Bulkhead Pattern** – Cô lập các thành phần để lỗi không lan rộng

---

## 3. Self-Healing Trong Azure – Các Dịch Vụ Liên Quan

### 3.1 Bản đồ dịch vụ Self-Healing

```
                        ┌───────────────────────────────┐
                        │      AZURE SELF-HEALING       │
                        │        ECOSYSTEM              │
                        └───────────────┬───────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            │                           │                           │
   ┌────────▼────────┐       ┌─────────▼─────────┐       ┌────────▼────────┐
   │   Application   │       │  Infrastructure   │       │    Networking   │
   │     Layer       │       │      Layer        │       │      Layer      │
   └────────┬────────┘       └─────────┬─────────┘       └────────┬────────┘
            │                          │                           │
    ┌───────┴───────┐          ┌───────┴───────┐          ┌───────┴───────┐
    │ App Service   │          │ VM Scale Sets │          │ Traffic Mgr   │
    │ Auto-Healing  │          │ Auto-Repair   │          │ Failover      │
    ├───────────────┤          ├───────────────┤          ├───────────────┤
    │ Azure         │          │ Availability  │          │ Load Balancer │
    │ Functions     │          │ Sets/Zones    │          │ Health Probes │
    ├───────────────┤          ├───────────────┤          ├───────────────┤
    │ AKS           │          │ Azure         │          │ Azure Front   │
    │ Self-Healing  │          │ Automation    │          │ Door          │
    └───────────────┘          └───────────────┘          └───────────────┘
            │                          │                           │
            └──────────────────────────┼───────────────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │    Azure Monitor        │
                          │  (Giám sát tập trung)   │
                          ├─────────────────────────┤
                          │ • Application Insights  │
                          │ • Log Analytics         │
                          │ • Alerts & Actions      │
                          │ • Autoscale             │
                          └─────────────────────────┘
```

### 3.2 Tóm tắt các dịch vụ

| Dịch vụ Azure | Khả năng Self-Healing | Khi nào dùng |
|--------------|----------------------|-------------|
| **App Service Auto-Healing** | Tự restart app khi phát hiện slow requests, memory leak, HTTP errors | Web apps, APIs trên App Service |
| **VM Scale Sets (VMSS)** | Tự thay thế VM unhealthy, auto-scale | Workload cần nhiều VM giống nhau |
| **Azure Kubernetes Service** | Pod restart, replica management, node auto-repair | Container-based microservices |
| **Azure Monitor Autoscale** | Tự scale in/out dựa trên metrics | Mọi dịch vụ hỗ trợ autoscale |
| **Traffic Manager** | DNS-based failover giữa các regions | Multi-region deployment |
| **Azure Load Balancer** | Health probe + tự loại bỏ backend unhealthy | Load balancing cùng region |
| **Azure Front Door** | Global load balancing + instant failover | Web apps global |
| **Azure Automation** | Chạy runbook tự động khi có alert | Tự động hóa phức tạp |
| **Azure Logic Apps** | Workflow tự động phản hồi sự cố | Integration & orchestration |

---

## 4. Azure App Service Auto-Healing

### 4.1 Giới thiệu

**Auto-Healing** là tính năng tích hợp sẵn trong Azure App Service cho phép tự động thực hiện hành động (restart, log, custom action) khi phát hiện ứng dụng gặp vấn đề dựa trên các điều kiện (triggers) được cấu hình trước.

### 4.2 Kiến trúc Auto-Healing

```
   ┌─────────────────────────────────────────────────┐
   │              Azure App Service                   │
   │                                                  │
   │  ┌──────────┐    ┌───────────┐    ┌──────────┐ │
   │  │ Web App  │    │ Auto-Heal │    │ Actions  │ │
   │  │ Process  │───▶│ Engine    │───▶│ Executor │ │
   │  │ (w3wp)   │    │           │    │          │ │
   │  └──────────┘    └───────────┘    └──────────┘ │
   │       │               │                │        │
   │       ▼               ▼                ▼        │
   │  ┌──────────┐   ┌──────────┐    ┌──────────┐  │
   │  │ Metrics  │   │ Triggers │    │ • Recycle │  │
   │  │ • CPU    │   │ • Count  │    │ • Log     │  │
   │  │ • Memory │   │ • Time   │    │ • Custom  │  │
   │  │ • Errors │   │ • Memory │    │   Action  │  │
   │  └──────────┘   └──────────┘    └──────────┘  │
   └─────────────────────────────────────────────────┘
```

### 4.3 Triggers (Điều kiện kích hoạt)

| Trigger | Mô tả | Ví dụ cấu hình |
|---------|-------|----------------|
| **Request Count** | Số request trong khoảng thời gian | 1000 requests trong 60 giây |
| **Slow Requests** | Requests chậm hơn ngưỡng | 100 requests > 30 giây trong 120 giây |
| **HTTP Status Codes** | Số lượng mã lỗi HTTP | 50 lỗi 500 trong 60 giây |
| **Memory Limit** | Sử dụng bộ nhớ vượt ngưỡng | Private bytes > 1GB |
| **Request Duration** | Thời gian xử lý request | > 200 giây |

### 4.4 Actions (Hành động phục hồi)

| Action | Mô tả |
|--------|-------|
| **Recycle** | Khởi động lại process worker (w3wp.exe) |
| **Log Event** | Ghi lại thông tin sự cố vào Event Log |
| **Custom Action** | Chạy script/executable tùy chỉnh (.exe, .cmd, .bat) |

### 4.5 Cấu hình Auto-Healing qua Azure Portal

**Bước 1:** Truy cập App Service → Diagnose and Solve Problems

**Bước 2:** Tìm "Auto-Healing" trong thanh tìm kiếm

**Bước 3:** Bật "Custom Auto-Healing Rules"

**Bước 4:** Cấu hình Trigger conditions:
- Chọn loại trigger (Request Count, Slow Requests, Memory, Status Codes)
- Đặt ngưỡng (threshold) và khoảng thời gian (time interval)

**Bước 5:** Cấu hình Action:
- Chọn hành động (Recycle, Log, Custom)
- Đặt Override When Action Exists nếu cần

**Bước 6:** Lưu và kiểm tra

### 4.6 Cấu hình qua web.config (Windows App Service)

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <monitoring>
      <triggers>
        <!-- Trigger khi có 100 requests với status 500 trong 60 giây -->
        <statusCode>
          <add statusCode="500" subStatusCode="0"
               win32StatusCode="0" count="100"
               timeInterval="00:01:00" />
        </statusCode>

        <!-- Trigger khi có 50 slow requests > 30s trong 120 giây -->
        <slowRequests timeTaken="00:00:30"
                      count="50"
                      timeInterval="00:02:00" />

        <!-- Trigger khi memory vượt 800MB -->
        <memory privateBytesInKB="819200" />
      </triggers>

      <actions value="Recycle">
        <!-- Thời gian tối thiểu giữa 2 lần action (tránh restart liên tục) -->
        <customAction exe="D:\home\site\scripts\collect-diagnostics.cmd"
                      parameters="" />
      </actions>
    </monitoring>
  </system.webServer>
</configuration>
```

### 4.7 Cấu hình qua Azure CLI

```bash
# Bật auto-healing cho App Service
az webapp config set \
  --resource-group MyResourceGroup \
  --name MyWebApp \
  --auto-heal-enabled true

# Cấu hình auto-healing rules qua ARM template
az webapp config set \
  --resource-group MyResourceGroup \
  --name MyWebApp \
  --generic-configurations '{"autoHealRules": {
    "triggers": {
      "statusCodes": [
        {
          "status": 500,
          "subStatus": 0,
          "win32Status": 0,
          "count": 10,
          "timeInterval": "00:05:00"
        }
      ]
    },
    "actions": {
      "actionType": "Recycle",
      "minProcessExecutionTime": "00:02:00"
    }
  }}'
```

---

## 5. Azure Virtual Machine Scale Sets – Self-Healing

### 5.1 Giới thiệu

**Azure Virtual Machine Scale Sets (VMSS)** cho phép tạo và quản lý một nhóm VM giống nhau, có khả năng tự động scale và tự phục hồi khi có VM lỗi.

### 5.2 Automatic Instance Repairs

Tính năng **Automatic Instance Repairs** tự động phát hiện và thay thế các VM unhealthy:

```
┌────────────────────────────────────────────────────────┐
│              VM Scale Set (VMSS)                        │
│                                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │
│  │  VM 1  │  │  VM 2  │  │  VM 3  │  │  VM 4  │      │
│  │Healthy │  │Healthy │  │  ❌    │  │Healthy │      │
│  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘      │
│      │           │           │            │             │
│      ▼           ▼           ▼            ▼             │
│  ┌─────────────────────────────────────────────┐       │
│  │        Health Probe / Extension             │       │
│  │   (Load Balancer / Application Health)      │       │
│  └────────────────────┬────────────────────────┘       │
│                       │                                 │
│                       ▼                                 │
│  ┌─────────────────────────────────────────────┐       │
│  │       Automatic Instance Repair             │       │
│  │  1. Phát hiện VM 3 unhealthy                │       │
│  │  2. Chờ grace period (30 phút mặc định)     │       │
│  │  3. Xóa VM 3                                │       │
│  │  4. Tạo VM mới thay thế                     │       │
│  └─────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────┘
```

### 5.3 Cấu hình Health Probe

**Cách 1: Application Health Extension (khuyên dùng)**

```json
{
  "type": "extensions",
  "name": "HealthExtension",
  "properties": {
    "publisher": "Microsoft.ManagedServices",
    "type": "ApplicationHealthLinux",
    "typeHandlerVersion": "1.0",
    "settings": {
      "protocol": "http",
      "port": 80,
      "requestPath": "/health"
    }
  }
}
```

**Cách 2: Load Balancer Health Probe**

```bash
# Tạo health probe cho Load Balancer
az network lb probe create \
  --resource-group MyResourceGroup \
  --lb-name MyLoadBalancer \
  --name MyHealthProbe \
  --protocol Http \
  --port 80 \
  --path /health \
  --interval 15 \
  --threshold 2
```

### 5.4 Bật Automatic Instance Repairs

```bash
# Bật automatic repairs với grace period 30 phút
az vmss update \
  --resource-group MyResourceGroup \
  --name MyScaleSet \
  --enable-automatic-repairs true \
  --automatic-repairs-grace-period 30

# Kiểm tra trạng thái
az vmss get-instance-view \
  --resource-group MyResourceGroup \
  --name MyScaleSet \
  --query "statuses"
```

### 5.5 Autoscale – Scale dựa trên metrics

```bash
# Tạo autoscale setting
az monitor autoscale create \
  --resource-group MyResourceGroup \
  --resource MyScaleSet \
  --resource-type Microsoft.Compute/virtualMachineScaleSets \
  --name MyAutoscaleSettings \
  --min-count 2 \
  --max-count 10 \
  --count 3

# Thêm rule scale-out khi CPU > 70%
az monitor autoscale rule create \
  --resource-group MyResourceGroup \
  --autoscale-name MyAutoscaleSettings \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 2

# Thêm rule scale-in khi CPU < 30%
az monitor autoscale rule create \
  --resource-group MyResourceGroup \
  --autoscale-name MyAutoscaleSettings \
  --condition "Percentage CPU < 30 avg 5m" \
  --scale in 1
```

---

## 6. Azure Kubernetes Service (AKS) – Self-Healing Pods

### 6.1 Giới thiệu

Kubernetes (và AKS) có cơ chế self-healing tích hợp mạnh mẽ: tự động restart container lỗi, reschedule pod khi node chết, và đảm bảo số lượng replica mong muốn.

### 6.2 Các cơ chế Self-Healing trong AKS

| Cơ chế | Mô tả |
|--------|-------|
| **Liveness Probe** | Kiểm tra container còn sống không → restart nếu fail |
| **Readiness Probe** | Kiểm tra container sẵn sàng nhận traffic → loại khỏi Service nếu fail |
| **Startup Probe** | Kiểm tra container khởi động xong chưa → chờ trước khi bật Liveness |
| **ReplicaSet** | Đảm bảo luôn có đủ số pod mong muốn → tạo mới nếu pod bị xóa/lỗi |
| **Node Auto-Repair** | AKS tự phát hiện node unhealthy → reboot hoặc thay thế node |
| **Pod Disruption Budget** | Đảm bảo luôn có tối thiểu số pod hoạt động khi maintenance |

### 6.3 Cấu hình Probes cho Pod

```yaml
# deployment-with-healing.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-web-app
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myregistry.azurecr.io/myapp:latest
        ports:
        - containerPort: 8080

        # Liveness Probe – Restart container nếu /healthz trả lỗi
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15    # Chờ 15s sau khi container start
          periodSeconds: 10          # Kiểm tra mỗi 10s
          failureThreshold: 3        # Fail 3 lần liên tiếp → restart
          timeoutSeconds: 5          # Timeout cho mỗi lần check

        # Readiness Probe – Loại khỏi Service nếu chưa sẵn sàng
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 3
          successThreshold: 1

        # Startup Probe – Cho phép container khởi động chậm
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          failureThreshold: 30       # Cho phép 30 lần fail (30 x 10s = 5 phút để khởi động)
          periodSeconds: 10

        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi

      restartPolicy: Always           # Luôn restart container khi lỗi
```

### 6.4 Horizontal Pod Autoscaler (HPA)

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # Scale khi CPU trung bình > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80    # Scale khi Memory trung bình > 80%
```

### 6.5 Pod Disruption Budget

```yaml
# pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web-pdb
spec:
  minAvailable: 2    # Luôn đảm bảo ít nhất 2 pod hoạt động
  selector:
    matchLabels:
      app: web
```

### 6.6 AKS Node Auto-Repair

AKS tự động giám sát trạng thái node:

| Trạng thái Node | Hành động |
|-----------------|---------|
| **NotReady** (>5 phút) | AKS cố gắng reboot node |
| **NotReady** (sau reboot) | AKS tạo node mới thay thế |
| **Unknown** (>5 phút) | AKS thực hiện tương tự NotReady |
| **MemoryPressure / DiskPressure** | Kubernetes tự taint node → không schedule pod mới |

```bash
# Tạo AKS cluster
az aks create \
  --resource-group MyResourceGroup \
  --name MyAKSCluster \
  --node-count 3 \
  --enable-cluster-autoscaler \
  --min-count 2 \
  --max-count 5

# Kiểm tra node health
kubectl get nodes
kubectl describe node <node-name> | grep -A 10 "Conditions"

# Kiểm tra pod restarts (dấu hiệu self-healing đang hoạt động)
kubectl get pods -o wide
kubectl describe pod <pod-name> | grep -A 5 "Restart Count"
```

---

## 7. Azure Monitor & Alerts – Giám Sát Và Tự Động Phản Hồi

### 7.1 Kiến trúc giám sát

```
┌──────────────────────────────────────────────────────────┐
│                     DATA SOURCES                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ App      │ │ VM       │ │ AKS      │ │ Custom   │   │
│  │ Service  │ │ Metrics  │ │ Logs     │ │ Metrics  │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
└───────┼─────────────┼────────────┼────────────┼──────────┘
        │             │            │            │
        ▼             ▼            ▼            ▼
┌──────────────────────────────────────────────────────────┐
│                   AZURE MONITOR                           │
│  ┌─────────────────┐    ┌──────────────────────┐        │
│  │  Metrics        │    │  Log Analytics       │        │
│  │  (Time-series)  │    │  (Kusto queries)     │        │
│  └────────┬────────┘    └──────────┬───────────┘        │
│           │                        │                     │
│           ▼                        ▼                     │
│  ┌──────────────────────────────────────────────┐       │
│  │              ALERT RULES                      │       │
│  │  • Metric alerts (CPU > 80%)                  │       │
│  │  • Log alerts (error count > threshold)       │       │
│  │  • Activity log alerts (resource deleted)     │       │
│  └────────────────────┬─────────────────────────┘       │
│                       │                                  │
│                       ▼                                  │
│  ┌──────────────────────────────────────────────┐       │
│  │             ACTION GROUPS                     │       │
│  │  • Email / SMS notification                   │       │
│  │  • Azure Function trigger                     │       │
│  │  • Logic App workflow                         │       │
│  │  • Automation Runbook                         │       │
│  │  • Webhook call                               │       │
│  │  • ITSM connector                             │       │
│  └──────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

### 7.2 Tạo Alert Rule tự động phục hồi

**Ví dụ: Tự động restart VM khi CPU > 95% trong 10 phút**

```bash
# Bước 1: Tạo Action Group với Automation Runbook
az monitor action-group create \
  --resource-group MyResourceGroup \
  --name AutoHealActionGroup \
  --short-name AutoHeal \
  --action automation-runbook \
    RestartVM \
    "/subscriptions/{sub-id}/resourceGroups/MyRG/providers/Microsoft.Automation/automationAccounts/MyAccount/runbooks/RestartVM" \
    "true" \
    "{sub-id}" \
    "MyRG" \
    "MyAutomationAccount"

# Bước 2: Tạo Metric Alert
az monitor metrics alert create \
  --resource-group MyResourceGroup \
  --name HighCPUAlert \
  --scopes "/subscriptions/{sub-id}/resourceGroups/MyRG/providers/Microsoft.Compute/virtualMachines/MyVM" \
  --condition "avg Percentage CPU > 95" \
  --window-size 10m \
  --evaluation-frequency 5m \
  --action AutoHealActionGroup \
  --severity 1 \
  --description "Auto-restart VM when CPU > 95% for 10 minutes"
```

### 7.3 Azure Automation Runbook – Ví dụ PowerShell

```powershell
# Runbook: Restart-UnhealthyVM.ps1
param(
    [string]$ResourceGroupName,
    [string]$VMName
)

# Kết nối Azure
Connect-AzAccount -Identity

# Ghi log
Write-Output "$(Get-Date) - Bắt đầu self-healing cho VM: $VMName"

# Kiểm tra trạng thái VM
$vmStatus = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName -Status
$powerState = ($vmStatus.Statuses | Where-Object { $_.Code -like "PowerState/*" }).DisplayStatus

Write-Output "Trạng thái hiện tại: $powerState"

if ($powerState -eq "VM running") {
    # Restart VM
    Write-Output "Đang restart VM..."
    Restart-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName

    # Chờ VM running
    Start-Sleep -Seconds 60

    # Kiểm tra lại
    $vmStatus = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName -Status
    $newPowerState = ($vmStatus.Statuses | Where-Object { $_.Code -like "PowerState/*" }).DisplayStatus
    Write-Output "Trạng thái sau restart: $newPowerState"

    if ($newPowerState -eq "VM running") {
        Write-Output "✅ Self-healing thành công!"
    } else {
        Write-Output "❌ Self-healing thất bại. Cần can thiệp thủ công."
    }
} else {
    Write-Output "VM không ở trạng thái running. Starting VM..."
    Start-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName
}
```

---

## 8. Azure Traffic Manager & Load Balancer – Failover Tự Động

### 8.1 Traffic Manager – DNS-based Failover

```
                    ┌─────────────────┐
                    │  Client Request  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Azure Traffic   │
                    │ Manager (DNS)   │
                    │                 │
                    │ Routing: Priority│
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Region 1 │  │ Region 2 │  │ Region 3 │
        │ (Primary)│  │ (Second) │  │ (Third)  │
        │ Priority │  │ Priority │  │ Priority │
        │    1     │  │    2     │  │    3     │
        │          │  │          │  │          │
        │ ✅ / ❌  │  │ ✅ / ❌  │  │ ✅ / ❌  │
        └──────────┘  └──────────┘  └──────────┘

    Khi Region 1 ❌ → Traffic tự động chuyển sang Region 2
    Khi Region 2 ❌ → Traffic tự động chuyển sang Region 3
```

### 8.2 Cấu hình Traffic Manager

```bash
# Tạo Traffic Manager profile với Priority routing
az network traffic-manager profile create \
  --resource-group MyResourceGroup \
  --name MyTrafficManager \
  --routing-method Priority \
  --unique-dns-name myapp-global \
  --monitor-protocol HTTPS \
  --monitor-port 443 \
  --monitor-path "/health" \
  --monitor-interval 10 \
  --monitor-timeout 5 \
  --monitor-tolerated-failures 3

# Thêm endpoint primary (Region Southeast Asia)
az network traffic-manager endpoint create \
  --resource-group MyResourceGroup \
  --profile-name MyTrafficManager \
  --name PrimaryEndpoint \
  --type azureEndpoints \
  --target-resource-id "/subscriptions/{sub}/resourceGroups/MyRG/providers/Microsoft.Web/sites/myapp-sea" \
  --priority 1

# Thêm endpoint secondary (Region East Asia)
az network traffic-manager endpoint create \
  --resource-group MyResourceGroup \
  --profile-name MyTrafficManager \
  --name SecondaryEndpoint \
  --type azureEndpoints \
  --target-resource-id "/subscriptions/{sub}/resourceGroups/MyRG/providers/Microsoft.Web/sites/myapp-ea" \
  --priority 2
```

### 8.3 Load Balancer Health Probes

```bash
# Tạo Load Balancer với health probe
az network lb create \
  --resource-group MyResourceGroup \
  --name MyLoadBalancer \
  --sku Standard \
  --frontend-ip-name MyFrontEnd \
  --backend-pool-name MyBackEndPool

# Tạo health probe
az network lb probe create \
  --resource-group MyResourceGroup \
  --lb-name MyLoadBalancer \
  --name MyHealthProbe \
  --protocol Http \
  --port 80 \
  --path "/health" \
  --interval 15 \
  --threshold 2

# Tạo load balancing rule
az network lb rule create \
  --resource-group MyResourceGroup \
  --lb-name MyLoadBalancer \
  --name MyLBRule \
  --protocol Tcp \
  --frontend-port 80 \
  --backend-port 80 \
  --frontend-ip-name MyFrontEnd \
  --backend-pool-name MyBackEndPool \
  --probe-name MyHealthProbe
```

---

## 9. Kịch Bản Thực Hành (Lab Scenarios)

### 9.1 Kịch bản 1: App Service Auto-Healing – Xử lý Memory Leak

**Mục tiêu:** Demo khả năng tự phục hồi khi ứng dụng bị memory leak

**Các bước thực hiện:**

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Tạo Resource Group | `az group create --name RG-Healing-Lab --location southeastasia` |
| 2 | Tạo App Service Plan | `az appservice plan create --name ASP-Lab --resource-group RG-Healing-Lab --sku S1` |
| 3 | Tạo Web App | `az webapp create --name my-healing-app --resource-group RG-Healing-Lab --plan ASP-Lab --runtime "NODE:18-lts"` |
| 4 | Deploy ứng dụng mẫu | Deploy Node.js app có endpoint `/leak` gây memory leak |
| 5 | Cấu hình Auto-Healing | Trigger: memory > 500MB → Action: Recycle |
| 6 | Gây sự cố | Gọi endpoint `/leak` nhiều lần để tăng memory |
| 7 | Quan sát | Theo dõi App Service logs → thấy auto-restart |
| 8 | Xác nhận | Ứng dụng tự khôi phục, memory trở về bình thường |

**Ứng dụng mẫu (Node.js):**

```javascript
// app.js - Ứng dụng demo memory leak
const express = require('express');
const app = express();

let memoryLeak = [];

// Endpoint bình thường
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const memUsedMB = process.memoryUsage().heapUsed / 1024 / 1024;
  if (memUsedMB > 400) {
    res.status(503).json({ status: 'unhealthy', memory: `${Math.round(memUsedMB)} MB` });
  } else {
    res.status(200).json({ status: 'healthy', memory: `${Math.round(memUsedMB)} MB` });
  }
});

// Endpoint gây memory leak (CHỈ DÙNG CHO DEMO)
app.get('/leak', (req, res) => {
  // Thêm 10MB vào memory mỗi lần gọi
  for (let i = 0; i < 100000; i++) {
    memoryLeak.push(new Array(100).fill('leak-data-' + Date.now()));
  }
  const memUsedMB = process.memoryUsage().heapUsed / 1024 / 1024;
  res.json({
    message: 'Memory increased',
    currentMemory: `${Math.round(memUsedMB)} MB`,
    leakArraySize: memoryLeak.length
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### 9.2 Kịch bản 2: AKS Self-Healing Pods

**Mục tiêu:** Demo Kubernetes tự restart pod khi container crash

**Các bước thực hiện:**

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Tạo AKS Cluster | `az aks create --name AKS-Lab --resource-group RG-Healing-Lab --node-count 2` |
| 2 | Kết nối kubectl | `az aks get-credentials --name AKS-Lab --resource-group RG-Healing-Lab` |
| 3 | Deploy ứng dụng | `kubectl apply -f deployment.yaml` (3 replicas, có liveness probe) |
| 4 | Kiểm tra pods | `kubectl get pods -w` (watch mode) |
| 5 | Gây sự cố pod | `kubectl exec <pod> -- kill 1` (kill process trong container) |
| 6 | Quan sát | Pod tự restart, RESTARTS count tăng lên |
| 7 | Gây sự cố node | Cordon + drain node → pods được reschedule sang node khác |
| 8 | Xác nhận | `kubectl get pods -o wide` → pods chạy trên node mới |

**Deployment YAML:**

```yaml
# deployment-healing-demo.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: healing-demo
spec:
  replicas: 3
  selector:
    matchLabels:
      app: healing-demo
  template:
    metadata:
      labels:
        app: healing-demo
    spec:
      containers:
      - name: app
        image: nginx:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 3
---
apiVersion: v1
kind: Service
metadata:
  name: healing-demo-svc
spec:
  selector:
    app: healing-demo
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

**Script demo:**

```bash
#!/bin/bash
# demo-aks-healing.sh

echo "=== KỊCH BẢN 2: AKS Self-Healing Demo ==="
echo ""

# Bước 1: Kiểm tra pods ban đầu
echo "📋 Bước 1: Kiểm tra pods ban đầu"
kubectl get pods -o wide
echo ""

# Bước 2: Gây crash cho 1 pod
echo "💥 Bước 2: Gây crash cho pod đầu tiên..."
POD_NAME=$(kubectl get pods -l app=healing-demo -o jsonpath='{.items[0].metadata.name}')
echo "Pod bị crash: $POD_NAME"
kubectl exec $POD_NAME -- kill 1
echo ""

# Bước 3: Quan sát quá trình self-healing
echo "🔄 Bước 3: Quan sát self-healing (30 giây)..."
sleep 5
kubectl get pods -o wide
echo ""

# Bước 4: Chờ pod recover
echo "⏳ Bước 4: Chờ pod phục hồi..."
sleep 25
kubectl get pods -o wide
echo ""

# Bước 5: Kiểm tra restart count
echo "📊 Bước 5: Kiểm tra restart count"
kubectl get pods -l app=healing-demo -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[0].restartCount}{"\n"}{end}'
echo ""

echo "✅ Demo hoàn thành! Pod đã tự phục hồi."
```

---

### 9.3 Kịch bản 3: VMSS Automatic Instance Repair

**Mục tiêu:** Demo VMSS tự thay thế VM unhealthy

**Các bước thực hiện:**

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Tạo VMSS | Tạo scale set với 3 instances |
| 2 | Cấu hình Health Extension | Cài Application Health Extension |
| 3 | Bật Automatic Repairs | `--enable-automatic-repairs true` |
| 4 | Kiểm tra trạng thái | Xác nhận 3 instances healthy |
| 5 | Gây sự cố | Stop web server trên 1 instance → health check fail |
| 6 | Quan sát | Instance chuyển sang Unhealthy → bị xóa → tạo mới |
| 7 | Xác nhận | VMSS trở lại 3 instances healthy |

```bash
# Tạo VMSS với automatic repairs
az vmss create \
  --resource-group RG-Healing-Lab \
  --name MyVMSS \
  --image Ubuntu2204 \
  --instance-count 3 \
  --vm-sku Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --custom-data cloud-init.yml

# Cài Health Extension
az vmss extension set \
  --resource-group RG-Healing-Lab \
  --vmss-name MyVMSS \
  --name ApplicationHealthLinux \
  --publisher Microsoft.ManagedServices \
  --version 1.0 \
  --settings '{"protocol":"http","port":80,"requestPath":"/health"}'

# Bật Automatic Repairs
az vmss update \
  --resource-group RG-Healing-Lab \
  --name MyVMSS \
  --enable-automatic-repairs true \
  --automatic-repairs-grace-period 10
```

---

### 9.4 Kịch bản 4: Traffic Manager Failover

**Mục tiêu:** Demo failover tự động giữa 2 regions

**Các bước thực hiện:**

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Tạo 2 Web Apps | 1 ở Southeast Asia (primary), 1 ở East Asia (secondary) |
| 2 | Tạo Traffic Manager | Priority routing, monitor /health |
| 3 | Test ban đầu | DNS resolve → primary endpoint |
| 4 | Gây sự cố primary | Stop App Service primary |
| 5 | Quan sát failover | Traffic Manager detect unhealthy → chuyển DNS sang secondary |
| 6 | Phục hồi primary | Start lại primary App Service |
| 7 | Xác nhận failback | Traffic Manager detect healthy → chuyển DNS về primary |

```bash
# Bước 1: Tạo 2 App Services ở 2 regions
az webapp create --name myapp-sea --resource-group RG-Healing-Lab \
  --plan ASP-SEA --runtime "NODE:18-lts"
az webapp create --name myapp-ea --resource-group RG-Healing-Lab \
  --plan ASP-EA --runtime "NODE:18-lts"

# Bước 2: Tạo Traffic Manager
az network traffic-manager profile create \
  --name TM-Failover \
  --resource-group RG-Healing-Lab \
  --routing-method Priority \
  --unique-dns-name myapp-failover-demo \
  --monitor-path "/health" \
  --monitor-protocol HTTPS \
  --monitor-port 443

# Bước 3: Thêm endpoints
az network traffic-manager endpoint create \
  --profile-name TM-Failover \
  --resource-group RG-Healing-Lab \
  --name SEA-Primary \
  --type azureEndpoints \
  --target-resource-id <sea-app-id> \
  --priority 1

az network traffic-manager endpoint create \
  --profile-name TM-Failover \
  --resource-group RG-Healing-Lab \
  --name EA-Secondary \
  --type azureEndpoints \
  --target-resource-id <ea-app-id> \
  --priority 2

# Bước 4: Test DNS resolution
nslookup myapp-failover-demo.trafficmanager.net

# Bước 5: Gây sự cố - Stop primary
az webapp stop --name myapp-sea --resource-group RG-Healing-Lab

# Bước 6: Chờ failover (30-90 giây) rồi test lại
sleep 60
nslookup myapp-failover-demo.trafficmanager.net
# → DNS sẽ trỏ sang EA endpoint

# Bước 7: Phục hồi primary
az webapp start --name myapp-sea --resource-group RG-Healing-Lab
```

---

## 10. Kế Hoạch Trình Bày Báo Cáo

### 10.1 Cấu trúc bài trình bày (Slide)

| Slide | Nội dung | Thời gian |
|-------|----------|-----------|
| 1 | Trang bìa: Tên đề tài, thông tin sinh viên | 30 giây |
| 2 | Mục lục / Agenda | 30 giây |
| 3-4 | Đặt vấn đề: Tại sao cần Self-Healing? | 2 phút |
| 5-6 | Khái niệm Self-Healing & Design Patterns | 3 phút |
| 7-8 | Tổng quan dịch vụ Azure hỗ trợ Self-Healing | 2 phút |
| 9-11 | App Service Auto-Healing (chi tiết + cấu hình) | 3 phút |
| 12-14 | AKS Self-Healing (Probes, ReplicaSet, Node Repair) | 3 phút |
| 15-16 | VMSS Automatic Instance Repair | 2 phút |
| 17-18 | Traffic Manager Failover | 2 phút |
| 19-20 | Azure Monitor & Automation | 2 phút |
| 21-23 | **DEMO LIVE** (Kịch bản 1 hoặc 2) | 5 phút |
| 24 | So sánh các phương pháp Self-Healing | 1 phút |
| 25 | Kết luận & Bài học rút ra | 1 phút |
| 26 | Q&A | 2 phút |
| | **Tổng cộng** | **~28 phút** |

### 10.2 Nội dung chi tiết từng phần

#### Phần 1: Đặt vấn đề (Slide 3-4)

**Nội dung cần trình bày:**
- Thống kê về downtime: Mỗi phút downtime gây thiệt hại trung bình $5,600 (theo Gartner, 2014 – "The Cost of Downtime")
- Ví dụ thực tế: Các sự cố lớn (AWS outage, Azure outage) và thời gian phục hồi
- So sánh: Manual recovery (phút → giờ) vs Self-Healing (giây → phút)
- Đặt câu hỏi: "Làm sao để hệ thống tự phục hồi mà không cần gọi điện cho admin lúc 3 giờ sáng?"

#### Phần 2: Khái niệm (Slide 5-6)

**Nội dung cần trình bày:**
- Định nghĩa Self-Healing
- Quy trình 4 bước: Monitor → Detect → Diagnose → Recover
- 7 chiến lược: Restart, Replace, Scale, Failover, Rollback, Reconfigure, Retry
- 6 Design Patterns liên quan (Retry, Circuit Breaker, Health Endpoint, v.v.)

#### Phần 3: Demo (Slide 21-23)

**Khuyến nghị:** Chọn **Kịch bản 2 (AKS Self-Healing)** vì:
- Trực quan nhất (thấy pod restart real-time)
- Dễ demo (chỉ cần kubectl)
- Nhanh (pod restart trong vài giây)

**Kịch bản demo:**
1. Show 3 pods đang chạy → `kubectl get pods -w`
2. Kill process trong 1 pod → `kubectl exec <pod> -- kill 1`
3. Quan sát pod tự restart → RESTARTS count tăng
4. Xóa 1 pod → `kubectl delete pod <pod>`
5. Quan sát ReplicaSet tạo pod mới → đủ 3 pods
6. Kết luận: Kubernetes tự phục hồi mà không cần can thiệp

### 10.3 Checklist chuẩn bị

- [ ] **Tài khoản Azure:** Đảm bảo có Azure subscription (Azure for Students hoặc Free Trial)
- [ ] **Cài đặt công cụ:**
  - [ ] Azure CLI (`az` command)
  - [ ] kubectl (cho demo AKS)
  - [ ] VS Code với Azure Extensions
  - [ ] Git
- [ ] **Chuẩn bị demo:**
  - [ ] Tạo Resource Group trước
  - [ ] Deploy ứng dụng mẫu trước buổi trình bày
  - [ ] Test demo 2-3 lần để đảm bảo hoạt động
  - [ ] Chuẩn bị video backup phòng trường hợp demo live lỗi
- [ ] **Slide trình bày:**
  - [ ] 25-26 slides theo cấu trúc trên
  - [ ] Có sơ đồ kiến trúc (lấy từ tài liệu này)
  - [ ] Có screenshot từ Azure Portal
  - [ ] Có code snippet cho mỗi phần
- [ ] **Tài liệu báo cáo:**
  - [ ] Bản báo cáo Word/PDF đầy đủ
  - [ ] Kèm code mẫu và script demo
  - [ ] Tài liệu tham khảo

### 10.4 So sánh tổng hợp các phương pháp

| Tiêu chí | App Service Auto-Healing | VMSS Auto-Repair | AKS Self-Healing | Traffic Manager |
|----------|-------------------------|-------------------|------------------|-----------------|
| **Cấp độ** | Application | Infrastructure (VM) | Container | Network/DNS |
| **Thời gian phục hồi** | Giây (restart process) | Phút (tạo VM mới) | Giây (restart pod) | 30-90 giây (DNS TTL) |
| **Phạm vi** | Trong 1 App Service | Trong 1 Scale Set | Trong 1 AKS Cluster | Giữa các regions |
| **Cấu hình** | Đơn giản (Portal/CLI) | Trung bình | Phức tạp (YAML) | Trung bình |
| **Use case** | Web apps, APIs | Stateless workloads | Microservices | Multi-region HA |
| **Chi phí** | Thấp | Trung bình | Trung bình - Cao | Thấp (DNS only) |
| **Tự động** | Hoàn toàn | Hoàn toàn | Hoàn toàn | Hoàn toàn |

### 10.5 Lưu ý quan trọng khi trình bày

1. **Bắt đầu bằng câu chuyện:** Kể về một sự cố thực tế → dẫn vào Self-Healing
2. **Demo là phần quan trọng nhất:** Chuẩn bị kỹ, test trước nhiều lần
3. **Giải thích WHY trước HOW:** Tại sao cần → rồi mới cách làm
4. **Có sơ đồ trực quan:** Mỗi service nên có 1 sơ đồ kiến trúc
5. **So sánh cuối:** Bảng so sánh giúp người nghe nhớ lâu
6. **Chuẩn bị Q&A:**
   - "Self-Healing có thay thế monitoring hoàn toàn không?" → Không, vẫn cần người giám sát
   - "Chi phí bao nhiêu?" → Tùy service, nhiều tính năng miễn phí (App Service, AKS probes)
   - "Nếu self-healing cũng fail thì sao?" → Escalation: auto → manual, cần alerting

---

## 11. Tài Liệu Tham Khảo

### Tài liệu chính thức Microsoft

1. **Azure App Service Auto-Healing**
   - https://learn.microsoft.com/en-us/azure/app-service/overview-diagnostics#auto-healing
   - https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html

2. **Azure VM Scale Sets – Automatic Instance Repairs**
   - https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs

3. **Azure Kubernetes Service**
   - https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads
   - https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

4. **Azure Monitor & Autoscale**
   - https://learn.microsoft.com/en-us/azure/azure-monitor/overview
   - https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-overview

5. **Azure Traffic Manager**
   - https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview

6. **Azure Automation Runbooks**
   - https://learn.microsoft.com/en-us/azure/automation/automation-runbook-types

### Design Patterns

7. **Cloud Design Patterns (Microsoft)**
   - https://learn.microsoft.com/en-us/azure/architecture/patterns/
   - Retry Pattern, Circuit Breaker, Health Endpoint Monitoring, etc.

### Sách & Khóa học

8. **"Designing Distributed Systems"** – Brendan Burns (O'Reilly)
9. **Microsoft Learn – Azure Fundamentals (AZ-900)**
   - https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/
10. **Microsoft Learn – AKS Workshop**
    - https://learn.microsoft.com/en-us/training/paths/intro-to-kubernetes-on-azure/

---

> **Ghi chú:** Tài liệu này được biên soạn để phục vụ báo cáo môn học. Các kịch bản thực hành cần có tài khoản Azure (Azure for Students miễn phí) và đã được thiết kế để sử dụng các dịch vụ có chi phí thấp hoặc miễn phí.
