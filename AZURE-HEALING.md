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

### 9.0 Yêu cầu chung – Chuẩn bị môi trường

> ⚠️ **Quan trọng:** Tất cả 4 kịch bản bên dưới đều yêu cầu hoàn thành các bước chuẩn bị này trước. Hãy thực hiện **một lần duy nhất** trước khi bắt đầu bất kỳ kịch bản nào.

**Bước 0.1 – Đăng ký tài khoản Azure**

- Truy cập https://azure.microsoft.com/en-us/free/students/ (Azure for Students – miễn phí $100 credit) hoặc https://azure.microsoft.com/en-us/free/ (Free Trial – $200 credit trong 30 ngày).
- Đăng ký bằng email trường (.edu) hoặc tài khoản Microsoft cá nhân.
- Sau khi đăng ký xong, đăng nhập vào https://portal.azure.com và xác nhận thấy subscription đang active.

**Bước 0.2 – Cài đặt Azure CLI trên máy local**

```bash
# Trên Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Trên macOS (dùng Homebrew)
brew update && brew install azure-cli

# Trên Windows (tải installer)
# Tải từ: https://aka.ms/installazurecliwindows
# Hoặc dùng winget:
winget install -e --id Microsoft.AzureCLI
```

Xác nhận cài đặt thành công:

```bash
az --version
# Kết quả mong đợi: azure-cli 2.x.x (hoặc mới hơn)
```

**Bước 0.3 – Đăng nhập Azure CLI**

```bash
az login
# Trình duyệt sẽ mở ra → đăng nhập bằng tài khoản Azure → quay lại terminal thấy thông tin subscription.
```

Xác nhận subscription:

```bash
az account show --query "{name:name, id:id, state:state}" -o table
# Kết quả mong đợi:
# Name                  Id                                    State
# --------------------  ------------------------------------  -------
# Azure for Students    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  Enabled
```

**Bước 0.4 – Cài đặt các công cụ bổ sung**

```bash
# Cài kubectl (cần cho kịch bản 2 - AKS)
az aks install-cli

# Cài Git (nếu chưa có)
# Ubuntu: sudo apt install git
# macOS: brew install git
# Windows: https://git-scm.com/downloads

# Cài Node.js 18 LTS (cần cho kịch bản 1 và 4)
# Ubuntu: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs
# macOS: brew install node@18
# Windows: https://nodejs.org/
```

Xác nhận:

```bash
kubectl version --client 2>/dev/null && echo "✅ kubectl OK" || echo "❌ kubectl chưa cài"
git --version && echo "✅ git OK"
node --version && echo "✅ node OK"
```

**Bước 0.5 – Tạo Resource Group dùng chung cho tất cả kịch bản**

```bash
az group create --name RG-Healing-Lab --location southeastasia
```

Xác nhận:

```bash
az group show --name RG-Healing-Lab --query "{name:name, location:location, provisioningState:properties.provisioningState}" -o table
# Kết quả mong đợi:
# Name             Location       ProvisioningState
# ---------------  -------------  -------------------
# RG-Healing-Lab   southeastasia  Succeeded
```

**Bước 0.6 – Tạo thư mục làm việc trên máy local**

```bash
mkdir -p ~/azure-healing-lab
cd ~/azure-healing-lab
```

> ✅ Sau khi hoàn thành 6 bước trên, bạn đã sẵn sàng thực hiện bất kỳ kịch bản nào bên dưới.

---

### 9.1 Kịch bản 1: App Service Auto-Healing – Xử lý Memory Leak

**Mục tiêu:** Demo khả năng tự phục hồi khi ứng dụng web bị memory leak – App Service tự động restart process khi phát hiện memory vượt ngưỡng.

**Thời gian ước tính:** 30–45 phút

**Chi phí ước tính:** ~$0.10/giờ (App Service Plan S1)

---

#### Bước 1.1 – Tạo thư mục dự án và khởi tạo ứng dụng Node.js

```bash
cd ~/azure-healing-lab
mkdir -p scenario1-appservice && cd scenario1-appservice
```

Tạo file `package.json`:

```bash
cat > package.json << 'EOF'
{
  "name": "healing-demo-app",
  "version": "1.0.0",
  "description": "Demo app for Azure App Service Auto-Healing (memory leak)",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF
```

Tạo file `app.js`:

```bash
cat > app.js << 'APPEOF'
const express = require('express');
const app = express();

let memoryLeak = [];

// Endpoint bình thường – hiển thị trạng thái
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
APPEOF
```

Xác nhận file đã tạo:

```bash
ls -la
# Kết quả mong đợi: app.js  package.json
```

#### Bước 1.2 – Cài dependencies và test ứng dụng trên local

```bash
npm install
```

Chạy thử local:

```bash
node app.js &
# Kết quả mong đợi: Server running on port 8080

curl http://localhost:8080/
# Kết quả mong đợi: {"status":"healthy","memory":"XX MB","timestamp":"..."}

curl http://localhost:8080/health
# Kết quả mong đợi: {"status":"healthy","memory":"XX MB"}

# Dừng server local
kill %1
```

#### Bước 1.3 – Tạo App Service Plan (tier S1 trở lên để hỗ trợ Auto-Healing)

```bash
az appservice plan create \
  --name ASP-Healing-Lab \
  --resource-group RG-Healing-Lab \
  --location southeastasia \
  --sku S1 \
  --is-linux
```

Xác nhận:

```bash
az appservice plan show \
  --name ASP-Healing-Lab \
  --resource-group RG-Healing-Lab \
  --query "{name:name, sku:sku.name, status:status}" -o table
# Kết quả mong đợi:
# Name              Sku    Status
# ----------------  -----  --------
# ASP-Healing-Lab   S1     Ready
```

> ⚠️ **Lưu ý:** Auto-Healing yêu cầu tối thiểu tier **Basic (B1)** trở lên. Tier Free (F1) và Shared (D1) **không hỗ trợ** Auto-Healing.

#### Bước 1.4 – Tạo Web App trên App Service

```bash
# Tạo tên webapp duy nhất (thêm random suffix để tránh trùng)
WEBAPP_NAME="healing-app-$(date +%s | tail -c 6)"
echo "Tên webapp: $WEBAPP_NAME"

az webapp create \
  --name $WEBAPP_NAME \
  --resource-group RG-Healing-Lab \
  --plan ASP-Healing-Lab \
  --runtime "NODE:18-lts"
```

Xác nhận webapp đã tạo và đang chạy:

```bash
az webapp show \
  --name $WEBAPP_NAME \
  --resource-group RG-Healing-Lab \
  --query "{name:name, state:state, defaultHostName:defaultHostName}" -o table
# Kết quả mong đợi:
# Name              State    DefaultHostName
# ----------------  -------  ---------------------------------
# healing-app-xxxxx Running  healing-app-xxxxx.azurewebsites.net
```

Truy cập thử (sẽ thấy trang mặc định):

```bash
curl https://$WEBAPP_NAME.azurewebsites.net
```

#### Bước 1.5 – Deploy ứng dụng lên App Service bằng Zip Deploy

```bash
# Đảm bảo đang ở thư mục dự án
cd ~/azure-healing-lab/scenario1-appservice

# Tạo file zip chứa code (bao gồm node_modules)
zip -r deploy.zip . -x ".git/*"

# Deploy lên App Service
az webapp deploy \
  --resource-group RG-Healing-Lab \
  --name $WEBAPP_NAME \
  --src-path deploy.zip \
  --type zip
```

Chờ 30–60 giây cho deployment hoàn tất, rồi xác nhận:

```bash
# Test endpoint chính
curl https://$WEBAPP_NAME.azurewebsites.net/
# Kết quả mong đợi: {"status":"healthy","memory":"XX MB","timestamp":"..."}

# Test health endpoint
curl https://$WEBAPP_NAME.azurewebsites.net/health
# Kết quả mong đợi: {"status":"healthy","memory":"XX MB"}
```

> Nếu thấy lỗi hoặc trang mặc định, chờ thêm 1–2 phút rồi thử lại. Kiểm tra logs:
> ```bash
> az webapp log tail --name $WEBAPP_NAME --resource-group RG-Healing-Lab
> ```

#### Bước 1.6 – Bật Auto-Healing trên App Service

```bash
# Bật tính năng auto-healing
az webapp config set \
  --resource-group RG-Healing-Lab \
  --name $WEBAPP_NAME \
  --auto-heal-enabled true
```

#### Bước 1.7 – Cấu hình Auto-Healing rules (trigger + action)

**Cách 1: Qua Azure Portal (trực quan, phù hợp demo)**

1. Truy cập https://portal.azure.com
2. Tìm App Service vừa tạo (`healing-app-xxxxx`) → Click vào
3. Menu bên trái → **Diagnose and solve problems**
4. Gõ "Auto-Healing" vào ô tìm kiếm → Click **Auto-Healing**
5. Chọn tab **Custom Auto-Healing Rules** → Bật **ON**
6. Trong phần **Conditions (Triggers)**, click **+ Add Rule**:
   - Chọn **Memory Limit** → Đặt **Private Bytes (KB)**: `512000` (= 500MB)
   - Hoặc chọn **Status Codes** → Status Code: `503`, Count: `5`, Time Interval: `00:01:00`
7. Trong phần **Actions**:
   - Chọn **Recycle** (khởi động lại process)
   - Đặt **Minimum Process Execution Time**: `00:02:00` (chờ tối thiểu 2 phút giữa 2 lần restart)
8. Click **Save**
9. Chụp screenshot cấu hình để đưa vào báo cáo

**Cách 2: Qua Azure CLI (tự động, phù hợp script)**

```bash
az resource update \
  --resource-group RG-Healing-Lab \
  --name $WEBAPP_NAME \
  --resource-type "Microsoft.Web/sites" \
  --set properties.siteConfig.autoHealEnabled=true \
  --set properties.siteConfig.autoHealRules='{"triggers":{"privateBytesInKB":512000,"statusCodes":[{"status":503,"subStatus":0,"win32Status":0,"count":5,"timeInterval":"00:01:00"}]},"actions":{"actionType":"Recycle","minProcessExecutionTime":"00:02:00"}}'
```

Xác nhận auto-healing đã bật:

```bash
az webapp config show \
  --name $WEBAPP_NAME \
  --resource-group RG-Healing-Lab \
  --query "autoHealEnabled"
# Kết quả mong đợi: true
```

#### Bước 1.8 – Bật Application Logging để theo dõi

```bash
# Bật logging filesystem
az webapp log config \
  --name $WEBAPP_NAME \
  --resource-group RG-Healing-Lab \
  --application-logging filesystem \
  --level information \
  --web-server-logging filesystem

# Mở log stream trong 1 terminal riêng (để theo dõi real-time)
az webapp log tail --name $WEBAPP_NAME --resource-group RG-Healing-Lab
```

> 💡 **Tip:** Mở 2 terminal – 1 terminal chạy `az webapp log tail` để theo dõi logs, terminal kia để gọi API gây sự cố.

#### Bước 1.9 – Ghi nhận trạng thái ban đầu (Baseline)

```bash
echo "=== TRẠNG THÁI BAN ĐẦU ==="
echo "Thời gian: $(date)"
curl -s https://$WEBAPP_NAME.azurewebsites.net/ | python3 -m json.tool
echo ""
echo "Health check:"
curl -s https://$WEBAPP_NAME.azurewebsites.net/health | python3 -m json.tool
```

> Chụp screenshot kết quả này cho báo cáo – đây là trạng thái "trước sự cố".

#### Bước 1.10 – Gây sự cố: Tạo memory leak

```bash
echo "=== BẮT ĐẦU GÂY SỰ CỐ MEMORY LEAK ==="

# Gọi /leak 20 lần liên tiếp, mỗi lần tăng ~10MB memory
for i in $(seq 1 20); do
  echo "--- Lần gọi $i ---"
  curl -s https://$WEBAPP_NAME.azurewebsites.net/leak | python3 -m json.tool
  sleep 2
done

echo ""
echo "=== KIỂM TRA TRẠNG THÁI SAU KHI GÂY LEAK ==="
curl -s https://$WEBAPP_NAME.azurewebsites.net/ | python3 -m json.tool
curl -s https://$WEBAPP_NAME.azurewebsites.net/health | python3 -m json.tool
```

> Quan sát terminal log tail – bạn sẽ thấy memory tăng dần qua từng lần gọi.

#### Bước 1.11 – Quan sát quá trình Auto-Healing

Trong terminal chạy `az webapp log tail`, quan sát các dòng log:
- Khi memory vượt ngưỡng 500MB → Auto-Heal engine kích hoạt
- Bạn sẽ thấy log dạng: `Auto Heal triggered` hoặc `Worker process recycled`
- Process w3wp sẽ bị kill và khởi tạo lại

Nếu dùng Azure Portal:
1. Vào App Service → **Diagnose and solve problems**
2. Tìm **Auto-Healing** → Xem tab **Detector Insights**
3. Sẽ thấy lịch sử các lần auto-heal đã xảy ra
4. Chụp screenshot cho báo cáo

```bash
# Kiểm tra lại trạng thái sau khi auto-heal (chờ 1–2 phút sau khi heal)
sleep 120

echo "=== TRẠNG THÁI SAU AUTO-HEALING ==="
echo "Thời gian: $(date)"
curl -s https://$WEBAPP_NAME.azurewebsites.net/ | python3 -m json.tool
curl -s https://$WEBAPP_NAME.azurewebsites.net/health | python3 -m json.tool
```

> Kết quả mong đợi: Memory trở về mức thấp (vài MB) vì process đã được restart → memoryLeak array bị reset.

#### Bước 1.12 – Ghi nhận kết quả và chụp screenshot

1. **So sánh trước/sau:** Memory trước leak (thấp) → Sau leak (cao) → Sau auto-heal (thấp lại)
2. **Screenshot Azure Portal:** Mục Diagnose and solve problems → Auto-Healing history
3. **Screenshot logs:** Dòng log ghi nhận auto-heal trigger
4. **Ghi note:** Thời gian từ lúc memory vượt ngưỡng → auto-heal kích hoạt → app khôi phục

#### Bước 1.13 – Dọn dẹp tài nguyên kịch bản 1

```bash
# Xóa Web App
az webapp delete --name $WEBAPP_NAME --resource-group RG-Healing-Lab

# Xóa App Service Plan
az appservice plan delete --name ASP-Healing-Lab --resource-group RG-Healing-Lab --yes

# Xác nhận đã xóa
az webapp list --resource-group RG-Healing-Lab --query "[].name" -o table
# Kết quả mong đợi: (trống, không còn webapp nào)
```

> ⚠️ **Quan trọng:** Luôn dọn dẹp tài nguyên sau khi demo xong để tránh phát sinh chi phí.

---

### 9.2 Kịch bản 2: AKS Self-Healing Pods

**Mục tiêu:** Demo Kubernetes (trên AKS) tự động restart pod khi container crash, và tự tạo pod mới khi pod bị xóa – nhờ ReplicaSet đảm bảo luôn có đủ số replica mong muốn.

**Thời gian ước tính:** 40–60 phút (AKS cluster mất ~10 phút để tạo)

**Chi phí ước tính:** ~$0.10/giờ (Standard_B2s × 2 nodes)

---

#### Bước 2.1 – Đăng ký resource providers cần thiết

```bash
# Đăng ký Microsoft.ContainerService (nếu chưa có)
az provider register --namespace Microsoft.ContainerService

# Kiểm tra trạng thái đăng ký
az provider show --namespace Microsoft.ContainerService --query "registrationState" -o tsv
# Kết quả mong đợi: Registered
```

> Nếu kết quả là "Registering", chờ 1–2 phút rồi kiểm tra lại.

#### Bước 2.2 – Tạo AKS Cluster

```bash
az aks create \
  --resource-group RG-Healing-Lab \
  --name AKS-Healing-Lab \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --generate-ssh-keys \
  --location southeastasia
```

> ⏱️ **Chờ 8–12 phút** cho cluster được tạo xong. Bạn sẽ thấy JSON output khi hoàn tất.

Xác nhận cluster đã tạo thành công:

```bash
az aks show \
  --resource-group RG-Healing-Lab \
  --name AKS-Healing-Lab \
  --query "{name:name, provisioningState:provisioningState, nodeCount:agentPoolProfiles[0].count}" -o table
# Kết quả mong đợi:
# Name              ProvisioningState    NodeCount
# ----------------  -------------------  ----------
# AKS-Healing-Lab   Succeeded            2
```

#### Bước 2.3 – Kết nối kubectl đến AKS Cluster

```bash
az aks get-credentials \
  --resource-group RG-Healing-Lab \
  --name AKS-Healing-Lab \
  --overwrite-existing
```

Xác nhận kết nối:

```bash
kubectl cluster-info
# Kết quả mong đợi: Kubernetes control plane is running at https://...

kubectl get nodes
# Kết quả mong đợi: 2 nodes ở trạng thái Ready
# NAME                                STATUS   ROLES   AGE   VERSION
# aks-nodepool1-xxxxx-vmss000000      Ready    agent   5m    v1.xx.x
# aks-nodepool1-xxxxx-vmss000001      Ready    agent   5m    v1.xx.x
```

#### Bước 2.4 – Tạo file Deployment YAML với Probes

```bash
cd ~/azure-healing-lab
mkdir -p scenario2-aks && cd scenario2-aks

cat > deployment-healing-demo.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: healing-demo
  labels:
    app: healing-demo
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
          timeoutSeconds: 3
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 3
          failureThreshold: 3
        resources:
          requests:
            cpu: 50m
            memory: 64Mi
          limits:
            cpu: 200m
            memory: 128Mi
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
EOF
```

Xác nhận file đã tạo:

```bash
cat deployment-healing-demo.yaml | head -5
# Kết quả mong đợi: apiVersion: apps/v1 ...
```

#### Bước 2.5 – Deploy ứng dụng lên AKS Cluster

```bash
kubectl apply -f deployment-healing-demo.yaml
# Kết quả mong đợi:
# deployment.apps/healing-demo created
# service/healing-demo-svc created
```

Chờ pods khởi động xong:

```bash
kubectl rollout status deployment/healing-demo --timeout=120s
# Kết quả mong đợi: deployment "healing-demo" successfully rolled out
```

#### Bước 2.6 – Xác nhận pods và service đang chạy

```bash
echo "=== PODS ==="
kubectl get pods -l app=healing-demo -o wide
# Kết quả mong đợi: 3 pods ở trạng thái Running, READY 1/1

echo ""
echo "=== SERVICE ==="
kubectl get svc healing-demo-svc
# Kết quả mong đợi: Service type LoadBalancer với EXTERNAL-IP (chờ 1–2 phút nếu thấy <pending>)

echo ""
echo "=== DEPLOYMENT ==="
kubectl get deployment healing-demo
# Kết quả mong đợi: READY 3/3, UP-TO-DATE 3, AVAILABLE 3
```

Nếu Service EXTERNAL-IP vẫn `<pending>`, chờ và kiểm tra lại:

```bash
kubectl get svc healing-demo-svc --watch
# Chờ cho đến khi thấy IP address, rồi Ctrl+C
```

Test truy cập ứng dụng:

```bash
EXTERNAL_IP=$(kubectl get svc healing-demo-svc -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "External IP: $EXTERNAL_IP"
curl http://$EXTERNAL_IP
# Kết quả mong đợi: HTML page mặc định của nginx (Welcome to nginx!)
```

#### Bước 2.7 – Ghi nhận trạng thái ban đầu (Baseline)

```bash
echo "=== TRẠNG THÁI BAN ĐẦU ==="
echo "Thời gian: $(date)"
echo ""

echo "--- Pods ---"
kubectl get pods -l app=healing-demo -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,NODE:.spec.nodeName,IP:.status.podIP"
echo ""

echo "--- Nodes ---"
kubectl get nodes -o custom-columns="NAME:.metadata.name,STATUS:.status.conditions[-1].type,PODS:.status.allocatable.pods"
```

> 📸 Chụp screenshot kết quả này – trạng thái "trước sự cố" với 3 pods Running, 0 RESTARTS.

#### Bước 2.8 – Demo A: Kill process trong container → Pod tự restart

```bash
echo "=== DEMO A: Kill process trong pod ==="
echo ""

# Lấy tên pod đầu tiên
POD_NAME=$(kubectl get pods -l app=healing-demo -o jsonpath='{.items[0].metadata.name}')
echo "🎯 Pod sẽ bị kill: $POD_NAME"
echo ""

# Ghi nhận trạng thái trước khi kill
echo "📋 Trước khi kill:"
kubectl get pods -l app=healing-demo
echo ""

# Kill PID 1 (process chính) trong container → container crash
echo "💥 Đang kill process..."
kubectl exec $POD_NAME -- kill 1
echo ""

# Chờ 5 giây rồi kiểm tra
echo "⏳ Chờ 5 giây..."
sleep 5

echo "🔄 Sau khi kill (5 giây):"
kubectl get pods -l app=healing-demo
echo ""

# Chờ thêm 15 giây cho pod phục hồi hoàn toàn
echo "⏳ Chờ thêm 15 giây cho pod phục hồi..."
sleep 15

echo "✅ Sau khi phục hồi (20 giây):"
kubectl get pods -l app=healing-demo -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,READY:.status.containerStatuses[0].ready"
```

> **Kết quả mong đợi:** Pod bị kill sẽ chuyển qua trạng thái `Error` hoặc `CrashLoopBackOff` → rồi tự restart → RESTARTS count tăng từ 0 lên 1 → STATUS trở lại `Running`.

> 📸 Chụp screenshot – đây là bằng chứng self-healing ở cấp container.

#### Bước 2.9 – Demo B: Xóa pod → ReplicaSet tạo pod mới

```bash
echo "=== DEMO B: Xóa pod → ReplicaSet tự tạo lại ==="
echo ""

# Lấy tên pod thứ hai
POD_TO_DELETE=$(kubectl get pods -l app=healing-demo -o jsonpath='{.items[1].metadata.name}')
echo "🎯 Pod sẽ bị xóa: $POD_TO_DELETE"
echo ""

echo "📋 Trước khi xóa (3 pods):"
kubectl get pods -l app=healing-demo
echo ""

# Xóa pod
echo "🗑️ Đang xóa pod..."
kubectl delete pod $POD_TO_DELETE
echo ""

# Kiểm tra ngay lập tức
echo "🔄 Ngay sau khi xóa:"
kubectl get pods -l app=healing-demo
echo ""

# Chờ pod mới khởi động
echo "⏳ Chờ 20 giây cho pod mới khởi động..."
sleep 20

echo "✅ Sau khi phục hồi:"
kubectl get pods -l app=healing-demo -o custom-columns="NAME:.metadata.name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,AGE:.metadata.creationTimestamp"
```

> **Kết quả mong đợi:** Pod bị xóa biến mất → ReplicaSet phát hiện chỉ còn 2 pods (desired = 3) → tự tạo pod mới → lại đủ 3 pods Running.

> 📸 Chụp screenshot – bằng chứng ReplicaSet self-healing.

#### Bước 2.10 – Demo C: Drain node → Pods reschedule sang node khác

```bash
echo "=== DEMO C: Drain node → Pods được reschedule ==="
echo ""

# Xem pods đang chạy trên node nào
echo "📋 Phân bố pods trên nodes:"
kubectl get pods -l app=healing-demo -o custom-columns="POD:.metadata.name,NODE:.spec.nodeName,STATUS:.status.phase"
echo ""

# Lấy node có nhiều pods nhất
TARGET_NODE=$(kubectl get pods -l app=healing-demo -o jsonpath='{.items[0].spec.nodeName}')
echo "🎯 Node sẽ bị drain: $TARGET_NODE"
echo ""

# Cordon node (ngăn schedule pods mới vào node này)
echo "🚫 Cordon node..."
kubectl cordon $TARGET_NODE
kubectl get nodes
echo ""

# Drain node (di chuyển tất cả pods ra khỏi node)
echo "💧 Drain node (evict pods)..."
kubectl drain $TARGET_NODE --ignore-daemonsets --delete-emptydir-data --force --grace-period=30
echo ""

# Chờ pods được reschedule
echo "⏳ Chờ 30 giây cho pods reschedule..."
sleep 30

echo "✅ Sau khi drain:"
kubectl get pods -l app=healing-demo -o custom-columns="POD:.metadata.name,NODE:.spec.nodeName,STATUS:.status.phase"
echo ""
kubectl get nodes
```

> **Kết quả mong đợi:** Pods trên node bị drain sẽ bị evict → Kubernetes tạo pods mới trên node còn lại → tất cả 3 pods Running trên node healthy.

> 📸 Chụp screenshot – bằng chứng pods tự di chuyển khi node bị drain.

Khôi phục node:

```bash
# Uncordon node (cho phép schedule lại)
echo "🔓 Uncordon node..."
kubectl uncordon $TARGET_NODE
kubectl get nodes
# Kết quả mong đợi: Cả 2 nodes đều Ready (không còn SchedulingDisabled)
```

#### Bước 2.11 – Xem chi tiết events và mô tả pod (cho báo cáo)

```bash
echo "=== EVENTS (chứng minh self-healing) ==="
kubectl get events --sort-by=.lastTimestamp --field-selector reason=Killing -A 2>/dev/null || true
kubectl get events --sort-by=.lastTimestamp --field-selector reason=Started -A 2>/dev/null || true
kubectl get events --sort-by=.lastTimestamp --field-selector reason=Created -A 2>/dev/null || true
echo ""

echo "=== MÔ TẢ POD (restart history) ==="
POD_CHECK=$(kubectl get pods -l app=healing-demo -o jsonpath='{.items[0].metadata.name}')
kubectl describe pod $POD_CHECK | grep -A 10 "Last State\|Restart Count\|Events"
```

> Copy kết quả events vào báo cáo – đây là log chứng minh Kubernetes tự phục hồi.

#### Bước 2.12 – Dọn dẹp tài nguyên kịch bản 2

```bash
# Xóa deployment và service
kubectl delete -f deployment-healing-demo.yaml
# Kết quả mong đợi:
# deployment.apps "healing-demo" deleted
# service "healing-demo-svc" deleted

# Xác nhận pods đã xóa
kubectl get pods -l app=healing-demo
# Kết quả mong đợi: No resources found

# Xóa AKS cluster (tốn nhiều tài nguyên, nên xóa ngay khi xong)
az aks delete \
  --resource-group RG-Healing-Lab \
  --name AKS-Healing-Lab \
  --yes --no-wait

echo "✅ Đã gửi lệnh xóa AKS cluster (sẽ mất 5-10 phút để xóa hoàn toàn)."
```

---

### 9.3 Kịch bản 3: VMSS Automatic Instance Repair

**Mục tiêu:** Demo Virtual Machine Scale Set (VMSS) tự động phát hiện VM unhealthy và thay thế bằng VM mới – sử dụng Application Health Extension và Automatic Instance Repairs.

**Thời gian ước tính:** 45–60 phút

**Chi phí ước tính:** ~$0.03/giờ (Standard_B1s × 3 instances)

---

#### Bước 3.1 – Tạo file cloud-init để cài web server tự động trên mỗi VM

```bash
cd ~/azure-healing-lab
mkdir -p scenario3-vmss && cd scenario3-vmss

cat > cloud-init.yml << 'EOF'
#cloud-config
package_upgrade: true
packages:
  - nginx
runcmd:
  - |
    # Tạo trang health check
    echo '{"status":"healthy","hostname":"'$(hostname)'"}' > /var/www/html/health
    # Tạo trang chính
    echo '<h1>Hello from '$(hostname)'</h1><p>Status: healthy</p>' > /var/www/html/index.html
    # Khởi động nginx
    systemctl enable nginx
    systemctl start nginx
EOF
```

Xác nhận file:

```bash
cat cloud-init.yml
```

#### Bước 3.2 – Tạo Virtual Network và Subnet cho VMSS

```bash
az network vnet create \
  --resource-group RG-Healing-Lab \
  --name VNet-VMSS \
  --address-prefix 10.0.0.0/16 \
  --subnet-name Subnet-VMSS \
  --subnet-prefix 10.0.1.0/24 \
  --location southeastasia
```

Xác nhận:

```bash
az network vnet show \
  --resource-group RG-Healing-Lab \
  --name VNet-VMSS \
  --query "{name:name, addressSpace:addressSpace.addressPrefixes[0], subnets:subnets[0].name}" -o table
# Kết quả mong đợi:
# Name       AddressSpace   Subnets
# ---------  -------------  -----------
# VNet-VMSS  10.0.0.0/16    Subnet-VMSS
```

#### Bước 3.3 – Tạo Public IP và Load Balancer

```bash
# Tạo Public IP
az network public-ip create \
  --resource-group RG-Healing-Lab \
  --name PIP-VMSS \
  --sku Standard \
  --allocation-method Static \
  --location southeastasia

# Tạo Load Balancer
az network lb create \
  --resource-group RG-Healing-Lab \
  --name LB-VMSS \
  --sku Standard \
  --frontend-ip-name FE-VMSS \
  --backend-pool-name BE-VMSS \
  --public-ip-address PIP-VMSS \
  --location southeastasia
```

Xác nhận:

```bash
az network lb show \
  --resource-group RG-Healing-Lab \
  --name LB-VMSS \
  --query "{name:name, frontendIP:frontendIPConfigurations[0].name, backendPool:backendAddressPools[0].name}" -o table
```

#### Bước 3.4 – Tạo Health Probe và Load Balancing Rule

```bash
# Tạo health probe (kiểm tra endpoint /health trên port 80)
az network lb probe create \
  --resource-group RG-Healing-Lab \
  --lb-name LB-VMSS \
  --name HealthProbe-HTTP \
  --protocol Http \
  --port 80 \
  --path "/health" \
  --interval 15 \
  --threshold 2

# Tạo load balancing rule
az network lb rule create \
  --resource-group RG-Healing-Lab \
  --lb-name LB-VMSS \
  --name LBRule-HTTP \
  --protocol Tcp \
  --frontend-port 80 \
  --backend-port 80 \
  --frontend-ip-name FE-VMSS \
  --backend-pool-name BE-VMSS \
  --probe-name HealthProbe-HTTP
```

Xác nhận probe:

```bash
az network lb probe show \
  --resource-group RG-Healing-Lab \
  --lb-name LB-VMSS \
  --name HealthProbe-HTTP \
  --query "{name:name, protocol:protocol, port:port, requestPath:requestPath, intervalInSeconds:intervalInSeconds}" -o table
```

#### Bước 3.5 – Tạo NSG (Network Security Group) cho phép HTTP và SSH

```bash
# Tạo NSG
az network nsg create \
  --resource-group RG-Healing-Lab \
  --name NSG-VMSS \
  --location southeastasia

# Cho phép HTTP (port 80)
az network nsg rule create \
  --resource-group RG-Healing-Lab \
  --nsg-name NSG-VMSS \
  --name Allow-HTTP \
  --priority 100 \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 80

# Cho phép SSH (port 22) – cần để gây sự cố
az network nsg rule create \
  --resource-group RG-Healing-Lab \
  --nsg-name NSG-VMSS \
  --name Allow-SSH \
  --priority 110 \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 22
```

#### Bước 3.6 – Tạo VMSS với 3 instances và cloud-init

```bash
az vmss create \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --image Ubuntu2204 \
  --instance-count 3 \
  --vm-sku Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --vnet-name VNet-VMSS \
  --subnet Subnet-VMSS \
  --load-balancer LB-VMSS \
  --backend-pool-name BE-VMSS \
  --nsg NSG-VMSS \
  --custom-data cloud-init.yml \
  --upgrade-policy-mode Automatic \
  --location southeastasia
```

> ⏱️ **Chờ 3–5 phút** cho 3 VMs được tạo và cloud-init chạy xong.

Xác nhận VMSS đã tạo:

```bash
az vmss show \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --query "{name:name, provisioningState:provisioningState, capacity:sku.capacity}" -o table
# Kết quả mong đợi:
# Name                ProvisioningState    Capacity
# ------------------  -------------------  ---------
# VMSS-Healing-Lab    Succeeded            3
```

Xem danh sách instances:

```bash
az vmss list-instances \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --query "[].{instanceId:instanceId, name:name, provisioningState:provisioningState}" -o table
# Kết quả mong đợi: 3 instances, tất cả Succeeded
```

#### Bước 3.7 – Chờ cloud-init hoàn tất và test web server

```bash
# Chờ 2 phút cho cloud-init cài nginx
echo "⏳ Chờ 2 phút cho cloud-init hoàn tất trên tất cả VMs..."
sleep 120

# Lấy Public IP của Load Balancer
LB_IP=$(az network public-ip show \
  --resource-group RG-Healing-Lab \
  --name PIP-VMSS \
  --query ipAddress -o tsv)
echo "Load Balancer IP: $LB_IP"

# Test truy cập qua Load Balancer
curl http://$LB_IP/
# Kết quả mong đợi: <h1>Hello from vmss-xxxxx</h1>

curl http://$LB_IP/health
# Kết quả mong đợi: {"status":"healthy","hostname":"vmss-xxxxx"}
```

> Nếu curl bị timeout, chờ thêm 1–2 phút cho cloud-init cài xong nginx.

#### Bước 3.8 – Cài Application Health Extension cho VMSS

```bash
az vmss extension set \
  --resource-group RG-Healing-Lab \
  --vmss-name VMSS-Healing-Lab \
  --name ApplicationHealthLinux \
  --publisher Microsoft.ManagedServices \
  --version 1.0 \
  --settings '{"protocol":"http","port":80,"requestPath":"/health"}'
```

Cập nhật tất cả instances:

```bash
az vmss update-instances \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --instance-ids "*"
```

> ⏱️ Chờ 2–3 phút cho extension cài đặt xong trên tất cả instances.

Xác nhận health extension đã cài:

```bash
az vmss extension list \
  --resource-group RG-Healing-Lab \
  --vmss-name VMSS-Healing-Lab \
  --query "[].{name:name, publisher:publisher, provisioningState:provisioningState}" -o table
# Kết quả mong đợi:
# Name                      Publisher                   ProvisioningState
# ------------------------  --------------------------  -------------------
# ApplicationHealthLinux     Microsoft.ManagedServices   Succeeded
```

#### Bước 3.9 – Bật Automatic Instance Repairs

```bash
az vmss update \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --enable-automatic-repairs true \
  --automatic-repairs-grace-period 10
```

Xác nhận:

```bash
az vmss show \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --query "{automaticRepairsPolicy:automaticRepairsPolicy}" -o json
# Kết quả mong đợi:
# {
#   "automaticRepairsPolicy": {
#     "enabled": true,
#     "gracePeriod": "PT10M"
#   }
# }
```

#### Bước 3.10 – Ghi nhận trạng thái ban đầu (Baseline)

```bash
echo "=== TRẠNG THÁI BAN ĐẦU VMSS ==="
echo "Thời gian: $(date)"
echo ""

az vmss list-instances \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --query "[].{instanceId:instanceId, name:name, provisioningState:provisioningState}" -o table

echo ""
echo "Test health check từng instance (qua LB):"
for i in $(seq 1 5); do
  curl -s http://$LB_IP/health
  echo ""
done
```

> 📸 Chụp screenshot – trạng thái "trước sự cố" với 3 instances healthy.

#### Bước 3.11 – Gây sự cố: Stop nginx trên 1 instance

Để gây sự cố, ta cần SSH vào 1 instance và stop nginx. Đầu tiên, cần tạo NAT rule để SSH:

```bash
# Tạo Inbound NAT Rule cho SSH đến instance 0
az network lb inbound-nat-rule create \
  --resource-group RG-Healing-Lab \
  --lb-name LB-VMSS \
  --name SSH-to-Instance0 \
  --protocol Tcp \
  --frontend-port 50000 \
  --backend-port 22 \
  --frontend-ip-name FE-VMSS

# Gắn NAT rule vào instance 0 NIC
# (Lưu ý: Tùy cấu hình VMSS, có thể cần dùng Run Command thay thế)
```

**Cách thay thế (đơn giản hơn) – Dùng Run Command:**

```bash
# Lấy instance ID đầu tiên
INSTANCE_ID=$(az vmss list-instances \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --query "[0].instanceId" -o tsv)
echo "Instance sẽ bị gây sự cố: $INSTANCE_ID"

# Stop nginx trên instance đó → health check sẽ fail
az vmss run-command invoke \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --instance-id $INSTANCE_ID \
  --command-id RunShellScript \
  --scripts "sudo systemctl stop nginx && echo 'nginx stopped on instance $INSTANCE_ID'"
```

Xác nhận nginx đã stop:

```bash
az vmss run-command invoke \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --instance-id $INSTANCE_ID \
  --command-id RunShellScript \
  --scripts "systemctl is-active nginx || echo 'nginx is NOT running'"
# Kết quả mong đợi: inactive hoặc nginx is NOT running
```

#### Bước 3.12 – Quan sát quá trình Automatic Instance Repair

```bash
echo "=== QUAN SÁT QUÁ TRÌNH REPAIR ==="
echo "Health Extension sẽ phát hiện instance unhealthy sau 15–30 giây."
echo "Sau grace period (10 phút), VMSS sẽ tự động thay thế instance."
echo ""

# Kiểm tra trạng thái health (mỗi 30 giây, trong 15 phút)
for i in $(seq 1 30); do
  echo "--- Kiểm tra lần $i ($(date +%H:%M:%S)) ---"
  az vmss list-instances \
    --resource-group RG-Healing-Lab \
    --name VMSS-Healing-Lab \
    --query "[].{id:instanceId, name:name, state:provisioningState}" -o table
  echo ""
  sleep 30
done
```

> **Kết quả mong đợi (theo thời gian):**
> - **0–30 giây:** Health Extension phát hiện instance unhealthy (nginx không phản hồi /health)
> - **30 giây – 10 phút:** Grace period – chờ xem instance có tự phục hồi không
> - **Sau 10 phút:** Automatic Repairs kích hoạt → xóa instance unhealthy → tạo instance mới
> - **Thêm 3–5 phút:** Instance mới khởi động, cloud-init cài nginx → instance trở lại healthy

> 📸 Chụp screenshot ở mỗi giai đoạn để làm bằng chứng cho báo cáo.

Bạn cũng có thể theo dõi qua Azure Portal:
1. Vào **Virtual Machine Scale Sets** → `VMSS-Healing-Lab`
2. Tab **Instances** → Quan sát cột **Health State** thay đổi
3. Tab **Activity Log** → Thấy events "Delete virtual machine" và "Create virtual machine"

#### Bước 3.13 – Xác nhận phục hồi thành công

```bash
echo "=== XÁC NHẬN PHỤC HỒI ==="

# Kiểm tra instances
az vmss list-instances \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --query "[].{instanceId:instanceId, name:name, provisioningState:provisioningState}" -o table
# Kết quả mong đợi: 3 instances, tất cả Succeeded

# Test health check
for i in $(seq 1 5); do
  curl -s http://$LB_IP/health
  echo ""
done
# Kết quả mong đợi: Tất cả trả về {"status":"healthy",...}

echo ""
echo "✅ VMSS đã tự phục hồi – instance unhealthy đã được thay thế bằng instance mới!"
```

#### Bước 3.14 – Dọn dẹp tài nguyên kịch bản 3

```bash
# Xóa VMSS
az vmss delete \
  --resource-group RG-Healing-Lab \
  --name VMSS-Healing-Lab \
  --yes

# Xóa Load Balancer
az network lb delete \
  --resource-group RG-Healing-Lab \
  --name LB-VMSS

# Xóa Public IP
az network public-ip delete \
  --resource-group RG-Healing-Lab \
  --name PIP-VMSS

# Xóa NSG
az network nsg delete \
  --resource-group RG-Healing-Lab \
  --name NSG-VMSS

# Xóa VNet
az network vnet delete \
  --resource-group RG-Healing-Lab \
  --name VNet-VMSS

# Xác nhận
az resource list --resource-group RG-Healing-Lab --query "[].{name:name, type:type}" -o table
# Kết quả mong đợi: Không còn tài nguyên VMSS/LB/VNet
```

---

### 9.4 Kịch bản 4: Traffic Manager Failover

**Mục tiêu:** Demo Azure Traffic Manager tự động chuyển traffic từ region primary (bị lỗi) sang region secondary – failover ở cấp DNS, không cần thay đổi code hay cấu hình client.

**Thời gian ước tính:** 30–45 phút

**Chi phí ước tính:** ~$0.15/giờ (2 App Service Plans S1 + Traffic Manager)

---

#### Bước 4.1 – Tạo thư mục dự án và ứng dụng Node.js cho 2 regions

```bash
cd ~/azure-healing-lab
mkdir -p scenario4-trafficmanager && cd scenario4-trafficmanager

cat > package.json << 'EOF'
{
  "name": "failover-demo-app",
  "version": "1.0.0",
  "description": "Demo app for Traffic Manager failover",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

cat > app.js << 'APPEOF'
const express = require('express');
const app = express();

const REGION = process.env.REGION || 'unknown';

app.get('/', (req, res) => {
  res.json({
    message: `Hello from ${REGION} region!`,
    region: REGION,
    hostname: require('os').hostname(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    region: REGION,
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[${REGION}] Server running on port ${PORT}`);
});
APPEOF

npm install
```

Xác nhận:

```bash
ls -la
# Kết quả mong đợi: app.js  node_modules  package.json  package-lock.json
```

#### Bước 4.2 – Tạo App Service Plan ở Region 1 (Southeast Asia – Primary)

```bash
az appservice plan create \
  --name ASP-SEA-Primary \
  --resource-group RG-Healing-Lab \
  --location southeastasia \
  --sku S1 \
  --is-linux
```

Xác nhận:

```bash
az appservice plan show \
  --name ASP-SEA-Primary \
  --resource-group RG-Healing-Lab \
  --query "{name:name, location:location, sku:sku.name}" -o table
# Kết quả mong đợi:
# Name              Location        Sku
# ----------------  --------------  ----
# ASP-SEA-Primary   southeastasia   S1
```

#### Bước 4.3 – Tạo App Service Plan ở Region 2 (East Asia – Secondary)

```bash
az appservice plan create \
  --name ASP-EA-Secondary \
  --resource-group RG-Healing-Lab \
  --location eastasia \
  --sku S1 \
  --is-linux
```

Xác nhận:

```bash
az appservice plan show \
  --name ASP-EA-Secondary \
  --resource-group RG-Healing-Lab \
  --query "{name:name, location:location, sku:sku.name}" -o table
```

#### Bước 4.4 – Tạo Web App ở Region 1 (Primary)

```bash
SUFFIX=$(date +%s | tail -c 6)
APP_SEA="failover-sea-$SUFFIX"
echo "Primary App: $APP_SEA"

az webapp create \
  --name $APP_SEA \
  --resource-group RG-Healing-Lab \
  --plan ASP-SEA-Primary \
  --runtime "NODE:18-lts"

# Đặt biến môi trường REGION
az webapp config appsettings set \
  --name $APP_SEA \
  --resource-group RG-Healing-Lab \
  --settings REGION="Southeast-Asia-PRIMARY"
```

Xác nhận:

```bash
az webapp show \
  --name $APP_SEA \
  --resource-group RG-Healing-Lab \
  --query "{name:name, state:state, location:location, defaultHostName:defaultHostName}" -o table
```

#### Bước 4.5 – Tạo Web App ở Region 2 (Secondary)

```bash
APP_EA="failover-ea-$SUFFIX"
echo "Secondary App: $APP_EA"

az webapp create \
  --name $APP_EA \
  --resource-group RG-Healing-Lab \
  --plan ASP-EA-Secondary \
  --runtime "NODE:18-lts"

# Đặt biến môi trường REGION
az webapp config appsettings set \
  --name $APP_EA \
  --resource-group RG-Healing-Lab \
  --settings REGION="East-Asia-SECONDARY"
```

#### Bước 4.6 – Deploy ứng dụng lên cả 2 Web Apps

```bash
# Tạo file zip
cd ~/azure-healing-lab/scenario4-trafficmanager
zip -r deploy.zip . -x ".git/*"

# Deploy lên Primary (Southeast Asia)
az webapp deploy \
  --resource-group RG-Healing-Lab \
  --name $APP_SEA \
  --src-path deploy.zip \
  --type zip

# Deploy lên Secondary (East Asia)
az webapp deploy \
  --resource-group RG-Healing-Lab \
  --name $APP_EA \
  --src-path deploy.zip \
  --type zip
```

Chờ 30–60 giây, rồi test cả 2 apps:

```bash
echo "=== Test Primary (SEA) ==="
curl -s https://$APP_SEA.azurewebsites.net/ | python3 -m json.tool
echo ""
curl -s https://$APP_SEA.azurewebsites.net/health | python3 -m json.tool
echo ""

echo "=== Test Secondary (EA) ==="
curl -s https://$APP_EA.azurewebsites.net/ | python3 -m json.tool
echo ""
curl -s https://$APP_EA.azurewebsites.net/health | python3 -m json.tool
```

> **Kết quả mong đợi:** Cả 2 apps đều trả về JSON với region tương ứng (Southeast-Asia-PRIMARY / East-Asia-SECONDARY).

#### Bước 4.7 – Lấy Resource ID của 2 Web Apps

```bash
SEA_APP_ID=$(az webapp show \
  --name $APP_SEA \
  --resource-group RG-Healing-Lab \
  --query "id" -o tsv)
echo "SEA App ID: $SEA_APP_ID"

EA_APP_ID=$(az webapp show \
  --name $APP_EA \
  --resource-group RG-Healing-Lab \
  --query "id" -o tsv)
echo "EA App ID: $EA_APP_ID"
```

#### Bước 4.8 – Tạo Traffic Manager Profile

```bash
TM_DNS="failover-demo-$SUFFIX"
echo "Traffic Manager DNS: $TM_DNS.trafficmanager.net"

az network traffic-manager profile create \
  --name TM-Failover-Lab \
  --resource-group RG-Healing-Lab \
  --routing-method Priority \
  --unique-dns-name $TM_DNS \
  --monitor-protocol HTTPS \
  --monitor-port 443 \
  --monitor-path "/health" \
  --monitor-interval 10 \
  --monitor-timeout 5 \
  --monitor-tolerated-failures 2
```

Xác nhận:

```bash
az network traffic-manager profile show \
  --name TM-Failover-Lab \
  --resource-group RG-Healing-Lab \
  --query "{name:name, dnsName:dnsConfig.fqdn, routingMethod:trafficRoutingMethod, monitorPath:monitorConfig.path}" -o table
# Kết quả mong đợi:
# Name              DnsName                                  RoutingMethod  MonitorPath
# ----------------  ---------------------------------------- -------------  -----------
# TM-Failover-Lab   failover-demo-xxxxx.trafficmanager.net   Priority       /health
```

#### Bước 4.9 – Thêm Primary Endpoint (Southeast Asia, Priority 1)

```bash
az network traffic-manager endpoint create \
  --profile-name TM-Failover-Lab \
  --resource-group RG-Healing-Lab \
  --name SEA-Primary \
  --type azureEndpoints \
  --target-resource-id $SEA_APP_ID \
  --priority 1 \
  --endpoint-status Enabled
```

#### Bước 4.10 – Thêm Secondary Endpoint (East Asia, Priority 2)

```bash
az network traffic-manager endpoint create \
  --profile-name TM-Failover-Lab \
  --resource-group RG-Healing-Lab \
  --name EA-Secondary \
  --type azureEndpoints \
  --target-resource-id $EA_APP_ID \
  --priority 2 \
  --endpoint-status Enabled
```

Xác nhận cả 2 endpoints:

```bash
az network traffic-manager endpoint list \
  --profile-name TM-Failover-Lab \
  --resource-group RG-Healing-Lab \
  --type azureEndpoints \
  --query "[].{name:name, priority:priority, endpointStatus:endpointStatus, endpointMonitorStatus:endpointMonitorStatus}" -o table
# Kết quả mong đợi (sau 30-60 giây):
# Name           Priority  EndpointStatus  EndpointMonitorStatus
# -------------  --------  --------------  ---------------------
# SEA-Primary    1         Enabled         Online
# EA-Secondary   2         Enabled         Online
```

> Nếu EndpointMonitorStatus là "CheckingEndpoint", chờ 30–60 giây rồi chạy lại.

#### Bước 4.11 – Ghi nhận trạng thái ban đầu và test Traffic Manager

```bash
echo "=== TRẠNG THÁI BAN ĐẦU ==="
echo "Thời gian: $(date)"
echo ""

# DNS Resolution
echo "--- DNS Resolution ---"
nslookup $TM_DNS.trafficmanager.net
echo ""

# Truy cập qua Traffic Manager (sẽ được route đến Primary)
echo "--- Truy cập qua Traffic Manager ---"
curl -s https://$TM_DNS.trafficmanager.net/ | python3 -m json.tool
echo ""

# Gọi nhiều lần để xác nhận luôn đến Primary
echo "--- Gọi 5 lần liên tiếp ---"
for i in $(seq 1 5); do
  REGION=$(curl -s https://$TM_DNS.trafficmanager.net/ | python3 -c "import sys,json; print(json.load(sys.stdin)['region'])" 2>/dev/null || echo "error")
  echo "Lần $i: $REGION"
done
```

> **Kết quả mong đợi:** Tất cả requests đều đến **Southeast-Asia-PRIMARY** (vì nó có priority 1).

> 📸 Chụp screenshot – trạng thái "trước sự cố", traffic luôn đến Primary.

#### Bước 4.12 – Gây sự cố: Stop Primary App Service

```bash
echo "=== GÂY SỰ CỐ: STOP PRIMARY ==="
echo "Thời gian: $(date)"
echo ""

az webapp stop --name $APP_SEA --resource-group RG-Healing-Lab
echo "✅ Primary App ($APP_SEA) đã bị stop."
echo ""

# Xác nhận Primary đã stop
az webapp show \
  --name $APP_SEA \
  --resource-group RG-Healing-Lab \
  --query "{name:name, state:state}" -o table
# Kết quả mong đợi: State = Stopped
```

#### Bước 4.13 – Quan sát quá trình Failover

```bash
echo "=== QUAN SÁT FAILOVER ==="
echo "Traffic Manager kiểm tra health mỗi 10 giây."
echo "Sau 2 lần fail liên tiếp → endpoint chuyển sang Degraded."
echo "DNS sẽ bắt đầu trỏ sang Secondary endpoint."
echo ""

# Theo dõi endpoint status (mỗi 15 giây, trong 3 phút)
for i in $(seq 1 12); do
  echo "--- Kiểm tra lần $i ($(date +%H:%M:%S)) ---"

  # Kiểm tra endpoint monitor status
  az network traffic-manager endpoint list \
    --profile-name TM-Failover-Lab \
    --resource-group RG-Healing-Lab \
    --type azureEndpoints \
    --query "[].{name:name, priority:priority, monitorStatus:endpointMonitorStatus}" -o table

  # Thử truy cập qua Traffic Manager
  RESPONSE=$(curl -s --max-time 5 https://$TM_DNS.trafficmanager.net/ 2>/dev/null || echo '{"region":"timeout/error"}')
  REGION=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('region','N/A'))" 2>/dev/null || echo "parse-error")
  echo "→ Traffic đến: $REGION"
  echo ""

  sleep 15
done
```

> **Kết quả mong đợi (theo thời gian):**
> - **0–20 giây:** SEA-Primary vẫn Online (chưa đến lượt check tiếp)
> - **20–40 giây:** SEA-Primary chuyển sang **Degraded** (health check fail 2 lần)
> - **40–90 giây:** DNS bắt đầu trả về Secondary endpoint → Traffic đến **East-Asia-SECONDARY**
> - **Sau 90 giây:** Tất cả traffic đều đến Secondary

> 📸 Chụp screenshot khi thấy endpoint SEA-Primary chuyển sang Degraded VÀ traffic đã chuyển sang Secondary.

#### Bước 4.14 – Xác nhận failover hoàn tất

```bash
echo "=== XÁC NHẬN FAILOVER ==="
echo "Thời gian: $(date)"
echo ""

# Endpoint status
az network traffic-manager endpoint list \
  --profile-name TM-Failover-Lab \
  --resource-group RG-Healing-Lab \
  --type azureEndpoints \
  --query "[].{name:name, priority:priority, monitorStatus:endpointMonitorStatus}" -o table
echo ""

# Gọi 5 lần – tất cả phải đến Secondary
echo "--- Gọi 5 lần qua Traffic Manager ---"
for i in $(seq 1 5); do
  REGION=$(curl -s https://$TM_DNS.trafficmanager.net/ | python3 -c "import sys,json; print(json.load(sys.stdin)['region'])" 2>/dev/null || echo "error")
  echo "Lần $i: $REGION"
done
```

> **Kết quả mong đợi:** SEA-Primary = Degraded, EA-Secondary = Online. Tất cả traffic đến **East-Asia-SECONDARY**.

#### Bước 4.15 – Phục hồi Primary và quan sát Failback

```bash
echo "=== PHỤC HỒI PRIMARY ==="
echo "Thời gian: $(date)"
echo ""

# Start lại Primary App
az webapp start --name $APP_SEA --resource-group RG-Healing-Lab
echo "✅ Primary App ($APP_SEA) đã được start lại."
echo ""

# Chờ app khởi động (30 giây)
echo "⏳ Chờ 30 giây cho app khởi động..."
sleep 30

# Xác nhận Primary đã chạy lại
curl -s https://$APP_SEA.azurewebsites.net/health | python3 -m json.tool
echo ""

# Theo dõi failback (Traffic Manager detect primary healthy → chuyển traffic về)
echo "=== QUAN SÁT FAILBACK ==="
for i in $(seq 1 12); do
  echo "--- Kiểm tra lần $i ($(date +%H:%M:%S)) ---"

  az network traffic-manager endpoint list \
    --profile-name TM-Failover-Lab \
    --resource-group RG-Healing-Lab \
    --type azureEndpoints \
    --query "[].{name:name, priority:priority, monitorStatus:endpointMonitorStatus}" -o table

  REGION=$(curl -s https://$TM_DNS.trafficmanager.net/ | python3 -c "import sys,json; print(json.load(sys.stdin).get('region','N/A'))" 2>/dev/null || echo "error")
  echo "→ Traffic đến: $REGION"
  echo ""

  sleep 15
done
```

> **Kết quả mong đợi:** Sau 30–90 giây, SEA-Primary chuyển lại Online → Traffic quay về **Southeast-Asia-PRIMARY**.

> 📸 Chụp screenshot – failback hoàn tất, traffic trở lại Primary.

#### Bước 4.16 – Tổng hợp kết quả cho báo cáo

```bash
echo "======================================"
echo "  TỔNG HỢP KẾT QUẢ KỊCH BẢN 4"
echo "======================================"
echo ""
echo "1. Ban đầu: Traffic → Southeast-Asia-PRIMARY (Priority 1)"
echo "2. Gây sự cố: Stop Primary → Traffic Manager detect Degraded"
echo "3. Failover: Traffic → East-Asia-SECONDARY (Priority 2)"
echo "   Thời gian failover: ~30-90 giây"
echo "4. Phục hồi: Start Primary → Traffic Manager detect Online"
echo "5. Failback: Traffic → Southeast-Asia-PRIMARY"
echo "   Thời gian failback: ~30-90 giây"
echo ""
echo "✅ Kết luận: Traffic Manager tự động failover/failback"
echo "   mà không cần thay đổi DNS hay cấu hình client."
```

#### Bước 4.17 – Dọn dẹp tài nguyên kịch bản 4

```bash
# Xóa Traffic Manager Profile (sẽ xóa cả endpoints)
az network traffic-manager profile delete \
  --name TM-Failover-Lab \
  --resource-group RG-Healing-Lab --yes

# Xóa Web App Primary
az webapp delete --name $APP_SEA --resource-group RG-Healing-Lab

# Xóa Web App Secondary
az webapp delete --name $APP_EA --resource-group RG-Healing-Lab

# Xóa App Service Plans
az appservice plan delete --name ASP-SEA-Primary --resource-group RG-Healing-Lab --yes
az appservice plan delete --name ASP-EA-Secondary --resource-group RG-Healing-Lab --yes

# Xác nhận
az resource list --resource-group RG-Healing-Lab --query "[].{name:name, type:type}" -o table
```

---

### 9.5 Dọn dẹp cuối cùng – Xóa Resource Group

> ⚠️ Sau khi hoàn thành **tất cả** kịch bản, xóa Resource Group để đảm bảo không còn tài nguyên nào phát sinh chi phí.

```bash
# Xóa toàn bộ Resource Group (sẽ xóa TẤT CẢ tài nguyên bên trong)
az group delete --name RG-Healing-Lab --yes --no-wait
echo "✅ Đã gửi lệnh xóa Resource Group. Quá trình xóa sẽ mất 5–10 phút."

# Xác nhận (sau 10 phút)
az group exists --name RG-Healing-Lab
# Kết quả mong đợi: false
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
