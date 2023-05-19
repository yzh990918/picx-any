import { UserConfigInfoModel } from '@/common/model'
import request from '@/utils/request'

/**
 * 获取分支信息列表
 * @param owner
 * @param repo
 * @param branch
 */
export const getBranchInfo = (owner: string, repo: string, branch: string) => {
  return request({
    url: `/repos/${owner}/${repo}/branches/${branch}`,
    method: 'GET'
  })
}

/**
 * 获取分支信息列表
 * @param owner
 * @param repo
 */
export const getBranchInfoList = (owner: string, repo: string): Promise<any> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const tmpList: any[] = await request({
      url: `/repos/${owner}/${repo}/branches`,
      method: 'GET'
    })

    if (tmpList && tmpList.length) {
      resolve(
        tmpList
          .filter((x) => !x.protected)
          .map((v) => ({
            value: v.name,
            label: v.name
          }))
          .reverse()
      )
    } else {
      resolve(null)
    }
  })
}

/**
 * 初始化空分支（未实现，待完善）
 * @param userConfigInfo
 * @param branch
 * @param callback
 */
export const createNewBranch = async (
  userConfigInfo: UserConfigInfoModel,
  branch: string,
  callback: any
) => {
  const { owner, selectedRepo: repo, branchList } = userConfigInfo

  const initLoading = ElLoading.service({
    text: `正在新建 ${branch} 分支...`
  })

  try {
    // 1、获取现有分支的 sha
    let sha = ''
    const res1 = await request({
      url: `/repos/${owner}/${repo}/git/refs/heads/${branchList[0].value}`,
      method: 'GET'
    })

    if (res1) {
      sha = res1.object.sha
    }

    if (!sha) {
      initLoading.close()
      ElMessage.error('新建分支失败')
      return
    }

    // 2、新建分支
    let newBranchSha = ''
    const res2 = await request({
      url: `/repos/${owner}/${repo}/git/refs`,
      method: 'POST',
      params: {
        ref: `refs/heads/${branch}`, // 新分支的名称
        sha
      }
    })

    if (res2) {
      newBranchSha = res2.object.sha
    }

    if (!newBranchSha) {
      initLoading.close()
      ElMessage.error('新建分支失败')
      return
    }

    // 3、强制更新分支
    const res3 = await request({
      url: `/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      method: 'PATCH',
      params: {
        force: true,
        sha: newBranchSha
      }
    })

    if (res3) {
      callback()
    }

    // 删除分支
    // await axios.delete(`/repos/${owner}/${repo}/git/refs/heads/${branch}`)
  } catch (err) {
    console.error(err)
  }
}
