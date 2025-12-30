#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
火山引擎图片换装API调用脚本
使用官方Python SDK或HTTP直接调用
"""
import sys
import json
import os
import hmac
import hashlib
from datetime import datetime
from urllib.parse import quote
import requests

# 尝试导入SDK，如果失败则使用HTTP直接调用
USE_SDK = False
try:
    import volcenginesdkcore
    USE_SDK = True
except ImportError:
    USE_SDK = False


def generate_signature(access_key_id, secret_access_key, method, url, headers, body, region='cn-north-1', service='cv'):
    """
    生成火山引擎API签名（Signature Version 4）
    """
    from urllib.parse import urlparse
    
    # 解析URL
    parsed_url = urlparse(url)
    path = parsed_url.path + ('?' + parsed_url.query if parsed_url.query else '')
    hostname = parsed_url.hostname
    
    # 生成时间戳
    now = datetime.utcnow()
    date = now.strftime('%Y%m%d')
    datetime_str = now.strftime('%Y%m%dT%H%M%SZ')
    
    # 构建规范请求
    canonical_headers = '\n'.join([f'{k.lower()}:{v}' for k, v in sorted(headers.items())])
    signed_headers = ';'.join([k.lower() for k in sorted(headers.keys())])
    payload_hash = hashlib.sha256(body.encode('utf-8')).hexdigest()
    
    canonical_request = f"{method}\n{path}\n\n{canonical_headers}\n\n{signed_headers}\n{payload_hash}"
    
    # 构建待签名字符串
    algorithm = 'HMAC-SHA256'
    credential_scope = f"{date}/{region}/{service}/request"
    canonical_request_hash = hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    string_to_sign = f"{algorithm}\n{datetime_str}\n{credential_scope}\n{canonical_request_hash}"
    
    # 计算签名
    k_date = hmac.new(secret_access_key.encode('utf-8'), date.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, region.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, 'request'.encode('utf-8'), hashlib.sha256).digest()
    signature = hmac.new(k_signing, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    # 构建Authorization header
    authorization = f"{algorithm} Credential={access_key_id}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    return authorization, datetime_str


def call_dress_api(person_image_url, top_garment_url, bottom_garment_url=None, access_key_id=None, secret_access_key=None):
    """
    调用火山引擎图片换装API
    使用HTTP直接调用（因为Visual SDK可能不可用）
    
    Args:
        person_image_url: 人物图片URL
        top_garment_url: 上装图片URL
        bottom_garment_url: 下装图片URL（可选）
        access_key_id: AccessKey ID
        secret_access_key: SecretAccessKey
    
    Returns:
        dict: API调用结果
    """
    try:
        # 构建服装数据数组
        garment_data = [
            {
                'url': top_garment_url,
                'type': 'top'
            }
        ]
        
        # 如果提供了下装URL，添加到数组中
        if bottom_garment_url:
            garment_data.append({
                'url': bottom_garment_url,
                'type': 'bottom'
            })
        
        # 构建请求体
        request_body = {
            'req_key': 'dressing_diffusion',
            'model': {
                'id': '1',
                'url': person_image_url
            },
            'garment': {
                'id': '1',
                'data': garment_data
            },
            'return_url': True,
            'inference_config': {
                'do_sr': False,
                'keep_head': True,
                'keep_hand': True,
                'keep_foot': True,
                'num_steps': 50
            }
        }
        
        body_json = json.dumps(request_body)
        
        # 构建URL
        url = 'https://visual.volcengineapi.com?Action=CVProcess&Version=2022-08-31'
        
        # 构建请求头
        headers = {
            'Content-Type': 'application/json',
            'Host': 'visual.volcengineapi.com'
        }
        
        # 生成签名
        authorization, x_date = generate_signature(
            access_key_id, 
            secret_access_key, 
            'POST', 
            url, 
            headers, 
            body_json
        )
        
        headers['Authorization'] = authorization
        headers['X-Date'] = x_date
        
        # 发送HTTP请求
        response = requests.post(url, headers=headers, data=body_json, timeout=120)
        
        # 解析响应
        result = response.json()
        
        if response.status_code == 200 and result.get('status') == 10000:
            image_urls = result.get('data', {}).get('image_urls', [])
            if image_urls:
                return {
                    'success': True,
                    'imageUrl': image_urls[0] if isinstance(image_urls, list) else image_urls,
                    'image_urls': image_urls if isinstance(image_urls, list) else [image_urls],
                    'message': 'success'
                }
            else:
                return {
                    'success': False,
                    'message': 'API返回成功但未包含图片URL',
                    'response': result
                }
        else:
            return {
                'success': False,
                'message': result.get('message') or f'API调用失败 (HTTP {response.status_code})',
                'status': result.get('status'),
                'code': result.get('code'),
                'response': result
            }
                
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'message': f'HTTP请求失败: {str(e)}',
            'error': str(e),
            'error_type': type(e).__name__
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'调用API时发生错误: {str(e)}',
            'error': str(e),
            'error_type': type(e).__name__
        }


def main():
    """
    主函数：从标准输入读取JSON参数，调用API，输出JSON结果
    """
    try:
        # 从标准输入读取JSON参数
        input_data = json.loads(sys.stdin.read())
        person_url = input_data.get('personImageUrl')
        top_garment_url = input_data.get('topGarmentUrl') or input_data.get('garmentImageUrl')
        bottom_garment_url = input_data.get('bottomGarmentUrl')
        
        # 从环境变量或参数获取AccessKey
        access_key_id = os.getenv('VOLCANO_ACCESS_KEY_ID') or input_data.get('accessKeyId')
        secret_access_key = os.getenv('VOLCANO_SECRET_ACCESS_KEY') or input_data.get('secretAccessKey')
        
        if not person_url or not top_garment_url:
            result = {
                'success': False,
                'message': '缺少必要参数：personImageUrl 和 topGarmentUrl'
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        if not access_key_id or not secret_access_key:
            result = {
                'success': False,
                'message': '缺少AccessKey配置，请设置环境变量或传入参数'
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        # 调用API
        result = call_dress_api(person_url, top_garment_url, bottom_garment_url, access_key_id, secret_access_key)
        
        # 输出JSON结果
        print(json.dumps(result, ensure_ascii=False))
        
        # 根据结果设置退出码
        sys.exit(0 if result.get('success') else 1)
        
    except json.JSONDecodeError as e:
        error_result = {
            'success': False,
            'message': f'JSON解析失败: {str(e)}',
            'error': str(e)
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)
    except Exception as e:
        error_result = {
            'success': False,
            'message': f'程序执行失败: {str(e)}',
            'error': str(e),
            'error_type': type(e).__name__
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)


if __name__ == '__main__':
    main()


"""
火山引擎图片换装API调用脚本
使用官方Python SDK或HTTP直接调用
"""
import sys
import json
import os
import hmac
import hashlib
from datetime import datetime
from urllib.parse import quote
import requests

# 尝试导入SDK，如果失败则使用HTTP直接调用
USE_SDK = False
try:
    import volcenginesdkcore
    USE_SDK = True
except ImportError:
    USE_SDK = False


def generate_signature(access_key_id, secret_access_key, method, url, headers, body, region='cn-north-1', service='cv'):
    """
    生成火山引擎API签名（Signature Version 4）
    """
    from urllib.parse import urlparse
    
    # 解析URL
    parsed_url = urlparse(url)
    path = parsed_url.path + ('?' + parsed_url.query if parsed_url.query else '')
    hostname = parsed_url.hostname
    
    # 生成时间戳
    now = datetime.utcnow()
    date = now.strftime('%Y%m%d')
    datetime_str = now.strftime('%Y%m%dT%H%M%SZ')
    
    # 构建规范请求
    canonical_headers = '\n'.join([f'{k.lower()}:{v}' for k, v in sorted(headers.items())])
    signed_headers = ';'.join([k.lower() for k in sorted(headers.keys())])
    payload_hash = hashlib.sha256(body.encode('utf-8')).hexdigest()
    
    canonical_request = f"{method}\n{path}\n\n{canonical_headers}\n\n{signed_headers}\n{payload_hash}"
    
    # 构建待签名字符串
    algorithm = 'HMAC-SHA256'
    credential_scope = f"{date}/{region}/{service}/request"
    canonical_request_hash = hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    string_to_sign = f"{algorithm}\n{datetime_str}\n{credential_scope}\n{canonical_request_hash}"
    
    # 计算签名
    k_date = hmac.new(secret_access_key.encode('utf-8'), date.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, region.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, 'request'.encode('utf-8'), hashlib.sha256).digest()
    signature = hmac.new(k_signing, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    # 构建Authorization header
    authorization = f"{algorithm} Credential={access_key_id}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    return authorization, datetime_str


def call_dress_api(person_image_url, top_garment_url, bottom_garment_url=None, access_key_id=None, secret_access_key=None):
    """
    调用火山引擎图片换装API
    使用HTTP直接调用（因为Visual SDK可能不可用）
    
    Args:
        person_image_url: 人物图片URL
        top_garment_url: 上装图片URL
        bottom_garment_url: 下装图片URL（可选）
        access_key_id: AccessKey ID
        secret_access_key: SecretAccessKey
    
    Returns:
        dict: API调用结果
    """
    try:
        # 构建服装数据数组
        garment_data = [
            {
                'url': top_garment_url,
                'type': 'top'
            }
        ]
        
        # 如果提供了下装URL，添加到数组中
        if bottom_garment_url:
            garment_data.append({
                'url': bottom_garment_url,
                'type': 'bottom'
            })
        
        # 构建请求体
        request_body = {
            'req_key': 'dressing_diffusion',
            'model': {
                'id': '1',
                'url': person_image_url
            },
            'garment': {
                'id': '1',
                'data': garment_data
            },
            'return_url': True,
            'inference_config': {
                'do_sr': False,
                'keep_head': True,
                'keep_hand': True,
                'keep_foot': True,
                'num_steps': 50
            }
        }
        
        body_json = json.dumps(request_body)
        
        # 构建URL
        url = 'https://visual.volcengineapi.com?Action=CVProcess&Version=2022-08-31'
        
        # 构建请求头
        headers = {
            'Content-Type': 'application/json',
            'Host': 'visual.volcengineapi.com'
        }
        
        # 生成签名
        authorization, x_date = generate_signature(
            access_key_id, 
            secret_access_key, 
            'POST', 
            url, 
            headers, 
            body_json
        )
        
        headers['Authorization'] = authorization
        headers['X-Date'] = x_date
        
        # 发送HTTP请求
        response = requests.post(url, headers=headers, data=body_json, timeout=120)
        
        # 解析响应
        result = response.json()
        
        if response.status_code == 200 and result.get('status') == 10000:
            image_urls = result.get('data', {}).get('image_urls', [])
            if image_urls:
                return {
                    'success': True,
                    'imageUrl': image_urls[0] if isinstance(image_urls, list) else image_urls,
                    'image_urls': image_urls if isinstance(image_urls, list) else [image_urls],
                    'message': 'success'
                }
            else:
                return {
                    'success': False,
                    'message': 'API返回成功但未包含图片URL',
                    'response': result
                }
        else:
            return {
                'success': False,
                'message': result.get('message') or f'API调用失败 (HTTP {response.status_code})',
                'status': result.get('status'),
                'code': result.get('code'),
                'response': result
            }
                
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'message': f'HTTP请求失败: {str(e)}',
            'error': str(e),
            'error_type': type(e).__name__
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'调用API时发生错误: {str(e)}',
            'error': str(e),
            'error_type': type(e).__name__
        }


def main():
    """
    主函数：从标准输入读取JSON参数，调用API，输出JSON结果
    """
    try:
        # 从标准输入读取JSON参数
        input_data = json.loads(sys.stdin.read())
        person_url = input_data.get('personImageUrl')
        top_garment_url = input_data.get('topGarmentUrl') or input_data.get('garmentImageUrl')
        bottom_garment_url = input_data.get('bottomGarmentUrl')
        
        # 从环境变量或参数获取AccessKey
        access_key_id = os.getenv('VOLCANO_ACCESS_KEY_ID') or input_data.get('accessKeyId')
        secret_access_key = os.getenv('VOLCANO_SECRET_ACCESS_KEY') or input_data.get('secretAccessKey')
        
        if not person_url or not top_garment_url:
            result = {
                'success': False,
                'message': '缺少必要参数：personImageUrl 和 topGarmentUrl'
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        if not access_key_id or not secret_access_key:
            result = {
                'success': False,
                'message': '缺少AccessKey配置，请设置环境变量或传入参数'
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        # 调用API
        result = call_dress_api(person_url, top_garment_url, bottom_garment_url, access_key_id, secret_access_key)
        
        # 输出JSON结果
        print(json.dumps(result, ensure_ascii=False))
        
        # 根据结果设置退出码
        sys.exit(0 if result.get('success') else 1)
        
    except json.JSONDecodeError as e:
        error_result = {
            'success': False,
            'message': f'JSON解析失败: {str(e)}',
            'error': str(e)
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)
    except Exception as e:
        error_result = {
            'success': False,
            'message': f'程序执行失败: {str(e)}',
            'error': str(e),
            'error_type': type(e).__name__
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)


if __name__ == '__main__':
    main()





